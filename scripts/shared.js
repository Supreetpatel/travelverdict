import "dotenv/config";
import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { aggregatePlatformScores, scoreSignal } from "../lib/scoring.js";

const { Pool } = pg;

function isLocalDatabaseUrl(url) {
  if (!url) {
    return false;
  }

  return /localhost|127\.0\.0\.1/i.test(url);
}

function resolveDatabaseUrl() {
  const candidates = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL,
  ].filter(Boolean);

  if (!candidates.length) {
    return null;
  }

  if (process.env.VERCEL) {
    const nonLocal = candidates.find((value) => !isLocalDatabaseUrl(value));
    if (nonLocal) {
      return nonLocal;
    }

    throw new Error(
      "Vercel cron cannot use localhost DATABASE_URL. Set POSTGRES_PRISMA_URL or a remote DATABASE_URL.",
    );
  }

  return process.env.DATABASE_URL ?? candidates[0];
}

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for worker scripts.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabaseUrl(databaseUrl)
    ? undefined
    : { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export function resolveReviewLimit() {
  const parsed = Number(process.env.SCRAPE_REVIEW_LIMIT ?? 100);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return 100;
  }
  return Math.min(parsed, 200);
}

export function makeExternalId(source, platformId, rawId, text) {
  if (rawId) {
    return `${source}:${rawId}`;
  }

  const digest = crypto
    .createHash("sha1")
    .update(`${source}|${platformId}|${text}`)
    .digest("hex")
    .slice(0, 20);

  return `${source}:hash:${digest}`;
}

export async function upsertReview({
  platformId,
  source,
  externalId,
  author,
  content,
  rating,
  url,
  createdAt,
  raw,
}) {
  const scored = scoreSignal(content, source, rating ?? null);

  await prisma.review.upsert({
    where: {
      source_externalId: {
        source,
        externalId,
      },
    },
    update: {
      author,
      content,
      rating: rating ?? null,
      url: url ?? null,
      sentimentScore: scored.sentimentScore,
      credibilityTier: scored.credibilityTier,
      supportSignal: scored.supportSignal,
      relatabilitySignal: scored.relatabilitySignal,
      helpfulnessSignal: scored.helpfulnessSignal,
      createdAt: createdAt ?? null,
      raw,
      scrapedAt: new Date(),
    },
    create: {
      platformId,
      source,
      externalId,
      author: author ?? null,
      content,
      rating: rating ?? null,
      url: url ?? null,
      sentimentScore: scored.sentimentScore,
      credibilityTier: scored.credibilityTier,
      supportSignal: scored.supportSignal,
      relatabilitySignal: scored.relatabilitySignal,
      helpfulnessSignal: scored.helpfulnessSignal,
      createdAt: createdAt ?? null,
      raw,
    },
  });
}

export async function refreshPlatformScores(platformId) {
  const windowHours = Number(process.env.SCORING_WINDOW_HOURS ?? 168);
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000);

  const reviews = await prisma.review.findMany({
    where: {
      platformId,
      scrapedAt: {
        gte: since,
      },
    },
    select: {
      supportSignal: true,
      relatabilitySignal: true,
      helpfulnessSignal: true,
      credibilityTier: true,
    },
  });

  const entries = reviews.map((review) => {
    const credibilityWeight =
      review.credibilityTier === "HIGH"
        ? 1.35
        : review.credibilityTier === "MEDIUM"
          ? 1.0
          : 0.65;

    return {
      credibilityTier: review.credibilityTier,
      credibilityWeight,
      supportSignal: review.supportSignal,
      relatabilitySignal: review.relatabilitySignal,
      helpfulnessSignal: review.helpfulnessSignal,
      sentimentScore: 0,
    };
  });

  const scores = aggregatePlatformScores(entries);

  await prisma.platform.update({
    where: { id: platformId },
    data: {
      supportScore: scores.supportScore,
      relatabilityScore: scores.relatabilityScore,
      helpfulnessScore: scores.helpfulnessScore,
      compositeScore: scores.compositeScore,
      lastScoredAt: new Date(),
    },
  });

  await prisma.scoreSnapshot.create({
    data: {
      platformId,
      supportScore: scores.supportScore,
      relatabilityScore: scores.relatabilityScore,
      helpfulnessScore: scores.helpfulnessScore,
      compositeScore: scores.compositeScore,
      windowHours,
    },
  });

  return scores;
}
