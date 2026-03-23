import "dotenv/config";
import crypto from "node:crypto";
import { db } from "../lib/neon-db.js";
import { aggregatePlatformScores, scoreSignal } from "../lib/scoring.js";

export async function getAllPlatforms() {
  return db`
    SELECT
      "id",
      "slug",
      "name",
      "handle",
      "playStoreAppId"
    FROM "Platform"
    ORDER BY "name" ASC
  `;
}

export async function getPlatformsWithPlayStoreAppId() {
  return db`
    SELECT
      "id",
      "slug",
      "name",
      "handle",
      "playStoreAppId"
    FROM "Platform"
    WHERE "playStoreAppId" IS NOT NULL
    ORDER BY "name" ASC
  `;
}

export async function disconnectDb() {
  // Neon serverless client is stateless and does not need explicit disconnect.
}

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
  const rawJson = raw ? JSON.stringify(raw) : null;

  await db`
    INSERT INTO "Review" (
      "id",
      "platformId",
      "source",
      "externalId",
      "author",
      "content",
      "rating",
      "url",
      "sentimentScore",
      "credibilityTier",
      "supportSignal",
      "relatabilitySignal",
      "helpfulnessSignal",
      "createdAt",
      "raw",
      "scrapedAt"
    )
    VALUES (
      ${crypto.randomUUID()},
      ${platformId},
      CAST(${source} AS "ReviewSource"),
      ${externalId},
      ${author ?? null},
      ${content},
      ${rating ?? null},
      ${url ?? null},
      ${scored.sentimentScore},
      CAST(${scored.credibilityTier} AS "CredibilityTier"),
      ${scored.supportSignal},
      ${scored.relatabilitySignal},
      ${scored.helpfulnessSignal},
      ${createdAt ?? null},
      CAST(${rawJson} AS jsonb),
      NOW()
    )
    ON CONFLICT ("source", "externalId")
    DO UPDATE SET
      "author" = EXCLUDED."author",
      "content" = EXCLUDED."content",
      "rating" = EXCLUDED."rating",
      "url" = EXCLUDED."url",
      "sentimentScore" = EXCLUDED."sentimentScore",
      "credibilityTier" = EXCLUDED."credibilityTier",
      "supportSignal" = EXCLUDED."supportSignal",
      "relatabilitySignal" = EXCLUDED."relatabilitySignal",
      "helpfulnessSignal" = EXCLUDED."helpfulnessSignal",
      "createdAt" = EXCLUDED."createdAt",
      "raw" = EXCLUDED."raw",
      "scrapedAt" = NOW()
  `;
}

export async function refreshPlatformScores(platformId) {
  const windowHours = Number(process.env.SCORING_WINDOW_HOURS ?? 168);
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000);

  const reviews = await db`
    SELECT
      "source",
      "supportSignal",
      "relatabilitySignal",
      "helpfulnessSignal",
      "credibilityTier"
    FROM "Review"
    WHERE "platformId" = ${platformId}
      AND "scrapedAt" >= ${since}
  `;

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

  const playStoreEntries = reviews
    .filter((review) => review.source === "PLAY_STORE")
    .map((review) => {
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

  const allSourceScores = aggregatePlatformScores(entries);
  const playStoreScores = aggregatePlatformScores(playStoreEntries);

  const scores = {
    supportScore: allSourceScores.supportScore,
    relatabilityScore: playStoreScores.relatabilityScore,
    helpfulnessScore: playStoreScores.helpfulnessScore,
    compositeScore: Math.round(
      allSourceScores.supportScore * 0.35 +
        playStoreScores.relatabilityScore * 0.3 +
        playStoreScores.helpfulnessScore * 0.35,
    ),
  };

  await db`
    UPDATE "Platform"
    SET
      "supportScore" = ${scores.supportScore},
      "relatabilityScore" = ${scores.relatabilityScore},
      "helpfulnessScore" = ${scores.helpfulnessScore},
      "compositeScore" = ${scores.compositeScore},
      "lastScoredAt" = NOW()
    WHERE "id" = ${platformId}
  `;

  await db`
    INSERT INTO "ScoreSnapshot" (
      "id",
      "platformId",
      "supportScore",
      "relatabilityScore",
      "helpfulnessScore",
      "compositeScore",
      "windowHours"
    )
    VALUES (
      ${crypto.randomUUID()},
      ${platformId},
      ${scores.supportScore},
      ${scores.relatabilityScore},
      ${scores.helpfulnessScore},
      ${scores.compositeScore},
      ${windowHours}
    )
  `;

  return scores;
}
