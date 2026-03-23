import { db } from "@/lib/neon-db";

function toneFromSentiment(score = 0) {
  if (score >= 2) {
    return "positive";
  }
  if (score <= -2) {
    return "negative";
  }
  return "neutral";
}

function sourceLabel(source) {
  if (source === "PLAY_STORE") {
    return "Play Store";
  }
  if (source === "REDDIT") {
    return "Reddit RSS";
  }
  return source;
}

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }
  return new Date(value).toISOString().slice(0, 10);
}

function relativeAgo(value) {
  if (!value) {
    return "just now";
  }

  const ms = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(ms / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toComparePlatform(platform) {
  return {
    id: platform.slug,
    name: platform.name,
    scores: {
      helpfulness: platform.helpfulnessScore,
      support: platform.supportScore,
      relatability: platform.relatabilityScore,
      composite: platform.compositeScore,
    },
  };
}

export async function getComparePlatforms() {
  try {
    const platforms = await db`
      SELECT
        "slug",
        "name",
        "supportScore",
        "relatabilityScore",
        "helpfulnessScore",
        "compositeScore"
      FROM "Platform"
      ORDER BY "compositeScore" DESC
    `;

    return platforms.map(toComparePlatform);
  } catch (error) {
    console.error("getComparePlatforms error:", error);
    return [];
  }
}

export async function getPlatformSlugs() {
  try {
    const items = await db`
      SELECT "slug"
      FROM "Platform"
      ORDER BY "compositeScore" DESC
    `;
    return items.map((item) => item.slug);
  } catch (error) {
    console.error("getPlatformSlugs error:", error);
    return [];
  }
}

export async function getPlatformProfile(slug) {
  try {
    const [platform] = await db`
      SELECT
        "id",
        "slug",
        "name",
        "supportScore",
        "relatabilityScore",
        "helpfulnessScore",
        "compositeScore"
      FROM "Platform"
      WHERE "slug" = ${slug}
      LIMIT 1
    `;

    if (!platform) {
      return null;
    }

    const reviews = await db`
      SELECT
        "source",
        "sentimentScore",
        "createdAt",
        "scrapedAt",
        "content"
      FROM "Review"
      WHERE "platformId" = ${platform.id}
        AND "source" IN ('PLAY_STORE'::"ReviewSource", 'REDDIT'::"ReviewSource")
      ORDER BY "scrapedAt" DESC
      LIMIT 40
    `;

    const snapshots = await db`
      SELECT "compositeScore"
      FROM "ScoreSnapshot"
      WHERE "platformId" = ${platform.id}
      ORDER BY "generatedAt" ASC
      LIMIT 12
    `;

    const history =
      snapshots.length > 1
        ? snapshots.map((snapshot) => snapshot.compositeScore)
        : Array.from({ length: 12 }, () => platform.compositeScore);

    return {
      id: platform.slug,
      name: platform.name,
      scores: {
        composite: platform.compositeScore,
        helpfulness: platform.helpfulnessScore,
        support: platform.supportScore,
        relatability: platform.relatabilityScore,
      },
      history,
      cityCoverage: "Growing across India",
      bharatCoverage: [],
      verifiedReviews: reviews.map((review) => ({
        source: sourceLabel(review.source),
        tone: toneFromSentiment(review.sentimentScore),
        date: formatDate(review.createdAt ?? review.scrapedAt),
        summary: review.content,
      })),
    };
  } catch (error) {
    console.error("getPlatformProfile error:", error);
    return null;
  }
}

export async function getArchiveData(limit = 120) {
  try {
    const reviews = await db`
      SELECT
        r."createdAt",
        r."scrapedAt",
        r."sentimentScore",
        r."credibilityTier",
        r."content",
        p."name" AS "platformName"
      FROM "Review" r
      JOIN "Platform" p ON p."id" = r."platformId"
      WHERE r."source" IN ('PLAY_STORE'::"ReviewSource", 'REDDIT'::"ReviewSource")
      ORDER BY r."scrapedAt" DESC
      LIMIT ${limit}
    `;

    const reviewArchive = reviews.map((review) => ({
      date: formatDate(review.createdAt ?? review.scrapedAt),
      platform: review.platformName,
      type: review.sentimentScore <= -2 ? "Horror Story" : "Positive Signal",
      title: review.content.slice(0, 72),
      summary: review.content,
    }));

    const lowCredibility = reviews.filter(
      (review) => review.credibilityTier === "LOW",
    ).length;
    const unresolvedSignals = reviews.filter(
      (review) => review.sentimentScore <= -2,
    ).length;
    const positiveSignals = reviews.filter(
      (review) => review.sentimentScore >= 2,
    ).length;

    return {
      reviewArchive,
      patternReports: [
        {
          title: "Low-credibility alert load",
          insight: `${lowCredibility} low-credibility reviews detected in the latest scan window.`,
        },
        {
          title: "Negative incident trend",
          insight: `${unresolvedSignals} strongly negative incidents were captured across platforms.`,
        },
        {
          title: "Positive recovery signals",
          insight: `${positiveSignals} strong positive recovery mentions were identified in user feedback.`,
        },
      ],
    };
  } catch (error) {
    console.error("getArchiveData error:", error);
    return {
      reviewArchive: [],
      patternReports: [],
    };
  }
}

export async function getRankedCategory(category) {
  try {
    const keyByCategory = {
      support: "supportScore",
      relatability: "relatabilityScore",
      helpfulness: "helpfulnessScore",
      composite: "compositeScore",
    };
    const orderColumn = keyByCategory[category] ?? "compositeScore";

    const ranked = await db`
      SELECT
        "name",
        "supportScore",
        "relatabilityScore",
        "helpfulnessScore",
        "compositeScore"
      FROM "Platform"
      ORDER BY
        CASE WHEN ${orderColumn} = 'supportScore' THEN "supportScore" END DESC,
        CASE WHEN ${orderColumn} = 'relatabilityScore' THEN "relatabilityScore" END DESC,
        CASE WHEN ${orderColumn} = 'helpfulnessScore' THEN "helpfulnessScore" END DESC,
        CASE WHEN ${orderColumn} = 'compositeScore' THEN "compositeScore" END DESC
      LIMIT 10
    `;

    return ranked.map((platform) => ({
      name: platform.name,
      score:
        category === "support"
          ? platform.supportScore
          : category === "relatability"
            ? platform.relatabilityScore
            : category === "helpfulness"
              ? platform.helpfulnessScore
              : platform.compositeScore,
    }));
  } catch (error) {
    console.error("getRankedCategory error:", error);
    return [];
  }
}

export async function getHomeFeedData() {
  try {
    // Get date range for today and yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reviews = await db`
      SELECT
        r."id",
        r."source",
        r."sentimentScore",
        r."createdAt",
        r."scrapedAt",
        r."content",
        p."name" AS "platformName"
      FROM "Review" r
      JOIN "Platform" p ON p."id" = r."platformId"
      WHERE COALESCE(r."createdAt", r."scrapedAt") >= ${yesterday}
      AND COALESCE(r."createdAt", r."scrapedAt") < ${tomorrow}
      AND r."source" IN ('PLAY_STORE'::"ReviewSource", 'REDDIT'::"ReviewSource")
      ORDER BY r."createdAt" DESC
      LIMIT 16
    `;

    if (!reviews.length) {
      return {
        reviewOfTheDay: null,
        trendingSignals: [],
      };
    }

    const highlighted = reviews[0];

    const reviewOfTheDay = {
      date: formatDate(highlighted.createdAt ?? highlighted.scrapedAt),
      platform: highlighted.platformName,
      title: highlighted.content.slice(0, 72),
      story: highlighted.content,
      impact:
        highlighted.sentimentScore <= -2
          ? `Negative signal impact: ${Math.abs(highlighted.sentimentScore)} points`
          : `Positive signal impact: +${highlighted.sentimentScore} points`,
      shareSlug: `${highlighted.platformName.toLowerCase().replace(/\s+/g, "-")}-${highlighted.id}`,
    };

    const trendingSignals = reviews.slice(0, 4).map((review) => ({
      id: review.id,
      platform: review.platformName,
      source: sourceLabel(review.source),
      sentiment: toneFromSentiment(review.sentimentScore),
      text: review.content,
      ago: relativeAgo(review.createdAt ?? review.scrapedAt),
    }));

    return {
      reviewOfTheDay,
      trendingSignals,
    };
  } catch (error) {
    console.error("getHomeFeedData error:", error);
    return {
      reviewOfTheDay: null,
      trendingSignals: [],
    };
  }
}
