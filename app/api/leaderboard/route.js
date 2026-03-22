import { NextResponse } from "next/server";
import { db } from "@/lib/neon-db";
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
  const reviews = await db`
    SELECT "content", "rating"
    FROM "Review"
    WHERE "platformId" = ${platformId}
      AND "source" = CAST(${source} AS "ReviewSource")
  `;

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

      platforms = await db`
        SELECT
          "id",
          "slug",
          "name",
          "logoUrl",
          "supportScore",
          "relatabilityScore",
          "helpfulnessScore",
          "compositeScore"
        FROM "Platform"
      `;

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
        const fallbackPlatforms = await db`
          SELECT
            "id",
            "slug",
            "name",
            "logoUrl",
            "supportScore",
            "relatabilityScore",
            "helpfulnessScore",
            "compositeScore"
          FROM "Platform"
          ORDER BY "compositeScore" DESC
          LIMIT 5
        `;

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
      platforms = await db`
        SELECT
          "id",
          "slug",
          "name",
          "logoUrl",
          "supportScore",
          "relatabilityScore",
          "helpfulnessScore",
          "compositeScore"
        FROM "Platform"
        ORDER BY
          CASE WHEN ${column} = 'supportScore' THEN "supportScore" END DESC,
          CASE WHEN ${column} = 'relatabilityScore' THEN "relatabilityScore" END DESC,
          CASE WHEN ${column} = 'helpfulnessScore' THEN "helpfulnessScore" END DESC,
          CASE WHEN ${column} = 'compositeScore' THEN "compositeScore" END DESC
        LIMIT 5
      `;
    }

    const rawData = await Promise.all(
      platforms.map(async (platform) => {
        // Get review counts and scores from all sources
        const [reviewStats] = await db`
          SELECT
            COUNT(*) FILTER (
              WHERE "source" = 'PLAY_STORE'::"ReviewSource"
                AND "rating" IS NOT NULL
            )::int AS "playStoreReviewCount",
            AVG("rating") FILTER (
              WHERE "source" = 'PLAY_STORE'::"ReviewSource"
                AND "rating" IS NOT NULL
            ) AS "playStoreAvgRating",
            COUNT(*) FILTER (
              WHERE "source" = 'REDDIT'::"ReviewSource"
            )::int AS "redditReviewCount",
            COUNT(*) FILTER (
              WHERE "source" = 'INSTAGRAM'::"ReviewSource"
            )::int AS "instagramReviewCount"
          FROM "Review"
          WHERE "platformId" = ${platform.id}
        `;

        const playStoreRating =
          Number(reviewStats.playStoreReviewCount) > 0
            ? Number(reviewStats.playStoreAvgRating).toFixed(2)
            : null;

        let score;
        let coverage;

        if (category === "playstore") {
          score = parseFloat(playStoreRating || 0);
          coverage = `${reviewStats.playStoreReviewCount} reviews from Google Play Store`;
        } else if (category === "reddit") {
          // If sourceScores exist (from source-based fetch), use it; otherwise calculate
          const sourceScore =
            platform.sourceScores?.compositeScore ||
            (await calculateSourceScores(platform.id, "REDDIT")).compositeScore;
          score = sourceScore;
          coverage = `${reviewStats.redditReviewCount} reviews from Reddit`;
        } else if (category === "instagram") {
          // If sourceScores exist (from source-based fetch), use it; otherwise calculate
          const sourceScore =
            platform.sourceScores?.compositeScore ||
            (await calculateSourceScores(platform.id, "INSTAGRAM"))
              .compositeScore;
          score = sourceScore;
          coverage = `${reviewStats.instagramReviewCount} reviews from Instagram`;
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
          playStoreReviewCount: reviewStats.playStoreReviewCount,
          redditReviewCount: reviewStats.redditReviewCount,
          instagramReviewCount: reviewStats.instagramReviewCount,
          coverage,
        };
      }),
    );

    const reviewCountByCategory = (item) => {
      if (category === "playstore") {
        return item.playStoreReviewCount ?? 0;
      }
      if (category === "reddit") {
        return item.redditReviewCount ?? 0;
      }
      if (category === "instagram") {
        return item.instagramReviewCount ?? 0;
      }
      return 0;
    };

    // Always rank by the score shown in the selected category (highest first).
    // Tie-breakers: more source reviews first, then alphabetical by platform name.
    const data = rawData
      .sort((a, b) => {
        const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        const countDiff = reviewCountByCategory(b) - reviewCountByCategory(a);
        if (countDiff !== 0) {
          return countDiff;
        }

        return a.name.localeCompare(b.name);
      })
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
