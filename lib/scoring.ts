export type SourceKind = "PLAY_STORE" | "REDDIT";

export type ScoredSignal = {
  credibilityTier: "LOW" | "MEDIUM" | "HIGH";
  credibilityWeight: number;
  supportSignal: number;
  relatabilitySignal: number;
  helpfulnessSignal: number;
  sentimentScore: number;
};

const SUPPORT_KEYWORDS = [
  "customer care",
  "support",
  "refund",
  "call",
  "helpline",
  "chat",
  "agent",
  "ticket",
  "cancel",
  "escalation",
];

const RELATABILITY_KEYWORDS = [
  "tier 2",
  "tier 3",
  "local",
  "vernacular",
  "hindi",
  "regional",
  "india",
  "indian context",
  "bharat",
  "small city",
];

const HELPFULNESS_KEYWORDS = [
  "ux",
  "ui",
  "booking",
  "checkout",
  "flow",
  "easy",
  "confusing",
  "success",
  "failed",
  "payment",
  "app crash",
];

const POSITIVE_WORDS = [
  "good",
  "great",
  "quick",
  "helpful",
  "resolved",
  "smooth",
  "easy",
  "fixed",
];

const NEGATIVE_WORDS = [
  "bad",
  "worst",
  "late",
  "delay",
  "failed",
  "useless",
  "refund issue",
  "broken",
  "crash",
];

export function inferCredibilityTier(
  text: string,
  source: SourceKind,
  rating?: number | null,
): { tier: "LOW" | "MEDIUM" | "HIGH"; weight: number } {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (source === "REDDIT" && wordCount >= 140) {
    return { tier: "HIGH", weight: 1.35 };
  }

  if (source === "PLAY_STORE" && typeof rating === "number") {
    if (wordCount >= 30 && (rating <= 2 || rating >= 4)) {
      return { tier: "MEDIUM", weight: 1.0 };
    }
    if (wordCount <= 4) {
      return { tier: "LOW", weight: 0.55 };
    }
  }

  if (wordCount >= 75) {
    return { tier: "MEDIUM", weight: 1.0 };
  }

  return { tier: "LOW", weight: 0.65 };
}

function keywordSignal(text: string, keywords: string[]): number {
  const normalized = text.toLowerCase();
  const hits = keywords.reduce((acc, keyword) => {
    return acc + (normalized.includes(keyword) ? 1 : 0);
  }, 0);
  return Math.min(
    100,
    Math.round((hits / Math.max(1, keywords.length / 3)) * 100),
  );
}

function sentiment(text: string): number {
  const normalized = text.toLowerCase();
  const positive = POSITIVE_WORDS.reduce(
    (acc, token) => acc + (normalized.includes(token) ? 1 : 0),
    0,
  );
  const negative = NEGATIVE_WORDS.reduce(
    (acc, token) => acc + (normalized.includes(token) ? 1 : 0),
    0,
  );
  return Math.max(-100, Math.min(100, (positive - negative) * 18));
}

export function scoreSignal(
  text: string,
  source: SourceKind,
  rating?: number | null,
): ScoredSignal {
  const { tier, weight } = inferCredibilityTier(text, source, rating);

  const supportBase = keywordSignal(text, SUPPORT_KEYWORDS);
  const relatabilityBase = keywordSignal(text, RELATABILITY_KEYWORDS);
  const helpfulnessBase = keywordSignal(text, HELPFULNESS_KEYWORDS);

  const sentimentScore = sentiment(text);
  const sentimentBoost = Math.round(sentimentScore * 0.16);

  const supportSignal = Math.max(
    0,
    Math.min(100, Math.round(supportBase * weight + sentimentBoost)),
  );
  const relatabilitySignal = Math.max(
    0,
    Math.min(100, Math.round(relatabilityBase * weight)),
  );
  const helpfulnessSignal = Math.max(
    0,
    Math.min(100, Math.round(helpfulnessBase * weight + sentimentBoost)),
  );

  return {
    credibilityTier: tier,
    credibilityWeight: weight,
    supportSignal,
    relatabilitySignal,
    helpfulnessSignal,
    sentimentScore,
  };
}

export function aggregatePlatformScores(entries: ScoredSignal[]) {
  if (!entries.length) {
    return {
      supportScore: 50,
      relatabilityScore: 50,
      helpfulnessScore: 50,
      compositeScore: 50,
    };
  }

  const weighted = entries.reduce(
    (acc, item) => {
      acc.weight += item.credibilityWeight;
      acc.support += item.supportSignal * item.credibilityWeight;
      acc.relatability += item.relatabilitySignal * item.credibilityWeight;
      acc.helpfulness += item.helpfulnessSignal * item.credibilityWeight;
      return acc;
    },
    { weight: 0, support: 0, relatability: 0, helpfulness: 0 },
  );

  const supportScore = Math.round(weighted.support / weighted.weight);
  const relatabilityScore = Math.round(weighted.relatability / weighted.weight);
  const helpfulnessScore = Math.round(weighted.helpfulness / weighted.weight);
  const compositeScore = Math.round(
    supportScore * 0.35 + relatabilityScore * 0.3 + helpfulnessScore * 0.35,
  );

  return { supportScore, relatabilityScore, helpfulnessScore, compositeScore };
}
