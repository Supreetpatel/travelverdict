import { NextResponse } from "next/server";
import { db } from "@/lib/neon-db";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const [platform] = await db`
      SELECT
        "id",
        "slug",
        "name",
        "logoUrl",
        "handle",
        "supportScore",
        "relatabilityScore",
        "helpfulnessScore",
        "compositeScore"
      FROM "Platform"
      WHERE "slug" = ${slug}
      LIMIT 1
    `;

    if (!platform) {
      return NextResponse.json(
        { error: "Platform not found" },
        { status: 404 },
      );
    }

    const snapshots = await db`
      SELECT
        "supportScore",
        "relatabilityScore",
        "helpfulnessScore",
        "compositeScore",
        "generatedAt"
      FROM "ScoreSnapshot"
      WHERE "platformId" = ${platform.id}
      ORDER BY "generatedAt" DESC
      LIMIT 12
    `;

    const reviews = await db`
      SELECT
        "source",
        "content",
        "rating",
        "url",
        "createdAt",
        "scrapedAt",
        "credibilityTier"
      FROM "Review"
      WHERE "platformId" = ${platform.id}
      ORDER BY "scrapedAt" DESC
      LIMIT 100
    `;

    return NextResponse.json({
      id: platform.id,
      slug: platform.slug,
      name: platform.name,
      logoUrl: platform.logoUrl,
      handle: platform.handle,
      scores: {
        support: platform.supportScore,
        relatability: platform.relatabilityScore,
        helpfulness: platform.helpfulnessScore,
        composite: platform.compositeScore,
      },
      snapshots: snapshots.map((snapshot) => ({
        supportScore: snapshot.supportScore,
        relatabilityScore: snapshot.relatabilityScore,
        helpfulnessScore: snapshot.helpfulnessScore,
        compositeScore: snapshot.compositeScore,
        generatedAt: snapshot.generatedAt,
      })),
      reviews: reviews.map((review) => ({
        source: review.source,
        content: review.content,
        rating: review.rating,
        url: review.url,
        createdAt: review.createdAt,
        scrapedAt: review.scrapedAt,
        credibilityTier: review.credibilityTier,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch platform", detail: String(error) },
      { status: 500 },
    );
  }
}
