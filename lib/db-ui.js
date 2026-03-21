import { prisma } from "@/lib/prisma";
import {
  getPlatformById,
  patternReports as fallbackPatternReports,
  platforms as fallbackPlatforms,
  rankedBy,
  reviewOfTheDay as fallbackReviewOfTheDay,
  reviewArchive as fallbackReviewArchive,
  trendingSignals as fallbackTrendingSignals,
  weeklyRoundup as fallbackWeeklyRoundup,
} from "@/app/data";

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
    return "App Store";
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

function getFallbackComparePlatforms() {
  return fallbackPlatforms.map((platform) => ({
    id: platform.id,
    name: platform.name,
    scores: platform.scores,
  }));
}

export async function getComparePlatforms() {
  try {
    const platforms = await prisma.platform.findMany({
      orderBy: { compositeScore: "desc" },
      select: {
        slug: true,
        name: true,
        supportScore: true,
        relatabilityScore: true,
        helpfulnessScore: true,
        compositeScore: true,
      },
    });

    if (!platforms.length) {
      return getFallbackComparePlatforms();
    }

    return platforms.map(toComparePlatform);
  } catch {
    return getFallbackComparePlatforms();
  }
}

export async function getPlatformSlugs() {
  try {
    const items = await prisma.platform.findMany({
      select: { slug: true },
      orderBy: { compositeScore: "desc" },
    });
    if (!items.length) {
      return fallbackPlatforms.map((platform) => platform.id);
    }
    return items.map((item) => item.slug);
  } catch {
    return fallbackPlatforms.map((platform) => platform.id);
  }
}

export async function getPlatformProfile(slug) {
  try {
    const platform = await prisma.platform.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: { scrapedAt: "desc" },
          take: 40,
        },
        snapshots: {
          orderBy: { generatedAt: "asc" },
          take: 12,
        },
      },
    });

    if (!platform) {
      return null;
    }

    const fallback = getPlatformById(slug);
    const history =
      platform.snapshots.length > 1
        ? platform.snapshots.map((snapshot) => snapshot.compositeScore)
        : (fallback?.history ??
          Array.from({ length: 12 }, () => platform.compositeScore));

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
      cityCoverage: fallback?.cityCoverage ?? "Growing across India",
      bharatCoverage: fallback?.bharatCoverage ?? [],
      verifiedReviews: platform.reviews.map((review) => ({
        source: sourceLabel(review.source),
        tone: toneFromSentiment(review.sentimentScore),
        date: formatDate(review.createdAt ?? review.scrapedAt),
        summary: review.content,
      })),
    };
  } catch {
    return getPlatformById(slug) ?? null;
  }
}

export async function getArchiveData(limit = 120) {
  try {
    const reviews = await prisma.review.findMany({
      take: limit,
      orderBy: { scrapedAt: "desc" },
      include: {
        platform: {
          select: { name: true },
        },
      },
    });

    if (!reviews.length) {
      return {
        reviewArchive: fallbackReviewArchive,
        patternReports: fallbackPatternReports,
      };
    }

    const reviewArchive = reviews.map((review) => ({
      date: formatDate(review.createdAt ?? review.scrapedAt),
      platform: review.platform.name,
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
  } catch {
    return {
      reviewArchive: fallbackReviewArchive,
      patternReports: fallbackPatternReports,
    };
  }
}

export async function getWeeklyRoundupData() {
  try {
    const platforms = await prisma.platform.findMany({
      select: {
        name: true,
        supportScore: true,
        relatabilityScore: true,
        helpfulnessScore: true,
        compositeScore: true,
        snapshots: {
          orderBy: { generatedAt: "desc" },
          take: 2,
          select: {
            compositeScore: true,
          },
        },
      },
      orderBy: { compositeScore: "desc" },
      take: 10,
    });

    if (!platforms.length) {
      return fallbackWeeklyRoundup;
    }

    const movements = platforms.map((platform) => {
      const latest =
        platform.snapshots[0]?.compositeScore ?? platform.compositeScore;
      const previous = platform.snapshots[1]?.compositeScore ?? latest;
      const delta = latest - previous;

      return {
        platform: platform.name,
        delta,
        reason:
          delta > 0
            ? "Composite trend improved from recent signals"
            : delta < 0
              ? "Composite trend softened in latest scoring cycle"
              : "No major composite movement this cycle",
      };
    });

    const topNegative = movements.slice().sort((a, b) => a.delta - b.delta)[0];

    return {
      weekLabel: `Week ${Math.ceil(new Date().getDate() / 7)}, ${new Date().getFullYear()}`,
      statOfTheWeek: topNegative
        ? `${topNegative.platform} recorded the sharpest weekly shift at ${topNegative.delta > 0 ? `+${topNegative.delta}` : topNegative.delta} points.`
        : "No significant weekly score movement detected.",
      movements,
    };
  } catch {
    return fallbackWeeklyRoundup;
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

    const ranked = await prisma.platform.findMany({
      orderBy: {
        [orderColumn]: "desc",
      },
      take: 10,
      select: {
        name: true,
        supportScore: true,
        relatabilityScore: true,
        helpfulnessScore: true,
        compositeScore: true,
      },
    });

    if (!ranked.length) {
      return rankedBy(category).map((item) => ({
        name: item.name,
        score: item.score,
      }));
    }

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
  } catch {
    return rankedBy(category).map((item) => ({
      name: item.name,
      score: item.score,
    }));
  }
}

export async function getHomeFeedData() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { scrapedAt: "desc" },
      take: 16,
      include: {
        platform: {
          select: { name: true },
        },
      },
    });

    if (!reviews.length) {
      return {
        reviewOfTheDay: fallbackReviewOfTheDay,
        trendingSignals: fallbackTrendingSignals,
      };
    }

    const highlighted =
      reviews.find((review) => review.sentimentScore <= -2) ?? reviews[0];

    const reviewOfTheDay = {
      date: formatDate(highlighted.createdAt ?? highlighted.scrapedAt),
      platform: highlighted.platform.name,
      title: highlighted.content.slice(0, 72),
      story: highlighted.content,
      impact:
        highlighted.sentimentScore <= -2
          ? `Negative signal impact: ${Math.abs(highlighted.sentimentScore)} points`
          : `Positive signal impact: +${highlighted.sentimentScore} points`,
      shareSlug: `${highlighted.platform.name.toLowerCase().replace(/\s+/g, "-")}-${highlighted.id}`,
    };

    const trendingSignals = reviews.slice(0, 4).map((review) => ({
      id: review.id,
      platform: review.platform.name,
      source: sourceLabel(review.source),
      sentiment: toneFromSentiment(review.sentimentScore),
      text: review.content,
      ago: relativeAgo(review.createdAt ?? review.scrapedAt),
    }));

    return {
      reviewOfTheDay,
      trendingSignals,
    };
  } catch {
    return {
      reviewOfTheDay: fallbackReviewOfTheDay,
      trendingSignals: fallbackTrendingSignals,
    };
  }
}
