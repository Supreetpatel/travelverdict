import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aggregatePlatformScores, scoreSignal } from "@/lib/scoring";

export const runtime = "nodejs";

const categoryColumn = {
  composite: "compositeScore",
  support: "supportScore",
  relatability: "relatabilityScore",
  helpfulness: "helpfulnessScore",
};

// Calculate scores for a specific source
async function calculateSourceScores(platformId, source) {
  const reviews = await prisma.review.findMany({
    where: {
      platformId,
      source,
    },
    select: {
      content: true,
      rating: true,
    },
  });

  if (reviews.length === 0) {
    return {
      supportScore: 50,
      relatabilityScore: 50,
      helpfulnessScore: 50,
      compositeScore: 50,
      reviewCount: 0,
    };
  }

  const signals = reviews.map((review) =>
    scoreSignal(review.content, source, review.rating),
  );
  const scores = aggregatePlatformScores(signals);

  return {
    ...scores,
    reviewCount: reviews.length,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const requestedCategory = searchParams.get("category") ?? "composite";
  const category =
    requestedCategory === "forums" ? "instagram" : requestedCategory;
  const column = categoryColumn[category] ?? categoryColumn.composite;

  try {
    let platforms;

    if (["playstore", "reddit", "instagram"].includes(category)) {
      // For source-specific categories
      const sourceMap = {
        playstore: "PLAY_STORE",
        reddit: "REDDIT",
        instagram: "INSTAGRAM",
      };
      const source = sourceMap[category];

      platforms = await prisma.platform.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          logoUrl: true,
          reviews: {
            where: {
              source,
            },
            select: {
              content: true,
              rating: true,
            },
          },
        },
      });

      // Calculate scores for this source and sort
      const withScores = await Promise.all(
        platforms.map(async (p) => ({
          ...p,
          sourceScores: await calculateSourceScores(p.id, source),
        })),
      );

      const rankedBySource = withScores
        .filter((p) => p.sourceScores.reviewCount > 0)
        .sort(
          (a, b) =>
            b.sourceScores.compositeScore - a.sourceScores.compositeScore,
        )
        .slice(0, 5);

      // If no Reddit/Instagram reviews exist yet, keep leaderboard populated with top platforms.
      if (rankedBySource.length === 0 && category !== "playstore") {
        const fallbackPlatforms = await prisma.platform.findMany({
          orderBy: {
            compositeScore: "desc",
          },
          take: 5,
          select: {
            id: true,
            slug: true,
            name: true,
            logoUrl: true,
            supportScore: true,
            relatabilityScore: true,
            helpfulnessScore: true,
            compositeScore: true,
          },
        });

        platforms = fallbackPlatforms.map((p) => ({
          ...p,
          sourceScores: {
            supportScore: 50,
            relatabilityScore: 50,
            helpfulnessScore: 50,
            compositeScore: 50,
            reviewCount: 0,
          },
        }));
      } else {
        platforms = rankedBySource;
      }
    } else {
      // For calculated categories, use the stored scores
      platforms = await prisma.platform.findMany({
        orderBy: {
          [column]: "desc",
        },
        take: 5,
        select: {
          id: true,
          slug: true,
          name: true,
          logoUrl: true,
          supportScore: true,
          relatabilityScore: true,
          helpfulnessScore: true,
          compositeScore: true,
        },
      });
    }

    const rawData = await Promise.all(
      platforms.map(async (platform) => {
        // Get review counts and scores from all sources
        const playStoreReviews = await prisma.review.findMany({
          where: {
            platformId: platform.id,
            source: "PLAY_STORE",
            rating: { not: null },
          },
          select: { rating: true },
        });

        const redditReviews = await prisma.review.findMany({
          where: {
            platformId: platform.id,
            source: "REDDIT",
          },
          select: { rating: true },
        });

        const instagramReviews = await prisma.review.findMany({
          where: {
            platformId: platform.id,
            source: "INSTAGRAM",
          },
          select: { rating: true },
        });

        const playStoreRating =
          playStoreReviews.length > 0
            ? (
                playStoreReviews.reduce((sum, r) => sum + r.rating, 0) /
                playStoreReviews.length
              ).toFixed(2)
            : null;

        let score;
        let coverage;

        if (category === "playstore") {
          score = parseFloat(playStoreRating || 0);
          coverage = `${playStoreReviews.length} reviews from Google Play Store`;
        } else if (category === "reddit") {
          // If sourceScores exist (from source-based fetch), use it; otherwise calculate
          const sourceScore =
            platform.sourceScores?.compositeScore ||
            (await calculateSourceScores(platform.id, "REDDIT")).compositeScore;
          score = sourceScore;
          coverage = `${redditReviews.length} reviews from Reddit`;
        } else if (category === "instagram") {
          // If sourceScores exist (from source-based fetch), use it; otherwise calculate
          const sourceScore =
            platform.sourceScores?.compositeScore ||
            (await calculateSourceScores(platform.id, "INSTAGRAM"))
              .compositeScore;
          score = sourceScore;
          coverage = `${instagramReviews.length} reviews from Instagram`;
        } else {
          score =
            category === "support"
              ? platform.supportScore
              : category === "relatability"
                ? platform.relatabilityScore
                : category === "helpfulness"
                  ? platform.helpfulnessScore
                  : platform.compositeScore;
          coverage = "Aggregated from all sources";
        }

        return {
          id: platform.slug,
          name: platform.name,
          logoUrl: platform.logoUrl,
          score,
          support: `${platform.supportScore || 50} score`,
          playStoreRating: playStoreRating ? parseFloat(playStoreRating) : null,
          playStoreReviewCount: playStoreReviews.length,
          redditReviewCount: redditReviews.length,
          instagramReviewCount: instagramReviews.length,
          coverage,
        };
      }),
    );

    // Always rank by the score shown in the selected category (highest first).
    const data = rawData
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    return NextResponse.json({ source: "database", category, data });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      {
        source: "database",
        category,
        data: [],
        error: "Database query failed",
      },
      { status: 500 },
    );
  }
}
