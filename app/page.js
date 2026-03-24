"use client";

import { ArrowRight, Share2, Star, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const FALLBACK_REVIEW_OF_THE_DAY = {
  date: "Today",
  platform: "StrateStats Network",
  title: "Users are prioritizing faster support response and cleaner check-in",
  story:
    "Recent traveler feedback highlights two recurring priorities: faster support turnaround and friction-free check-in. Platforms improving these basics continue to earn stronger trust and repeat usage.",
  impact:
    "Signal impact: Baseline watchlist is active while live feed refreshes.",
};

const FALLBACK_TRENDING_SIGNALS = [
  {
    id: "fallback-signal-1",
    platform: "StrateStats Network",
    source: "Insights",
    sentiment: "neutral",
    text: "Service responsiveness and first-response time are being mentioned more often across user feedback.",
    ago: "Now",
  },
  {
    id: "fallback-signal-2",
    platform: "StrateStats Network",
    source: "Insights",
    sentiment: "positive",
    text: "Clear cancellation policies and proactive support updates are contributing to better overall sentiment.",
    ago: "Now",
  },
];

function normalizeReviewOfTheDay(review) {
  if (!review || typeof review !== "object") {
    return FALLBACK_REVIEW_OF_THE_DAY;
  }

  return {
    ...FALLBACK_REVIEW_OF_THE_DAY,
    ...review,
  };
}

function normalizeTrendingSignals(signals) {
  if (!Array.isArray(signals) || signals.length === 0) {
    return FALLBACK_TRENDING_SIGNALS;
  }

  return signals.map((signal, index) => ({
    ...FALLBACK_TRENDING_SIGNALS[index % FALLBACK_TRENDING_SIGNALS.length],
    ...signal,
    id: signal?.id ?? `fallback-signal-dynamic-${index}`,
  }));
}

function shortenText(value, maxLength) {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function PremiumStarBadge() {
  return (
    <span className="premium-star-badge" aria-hidden="true">
      <span className="premium-star-ring" />
      <Star size={14} className="premium-star-core" fill="currentColor" />
    </span>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("playstore");
  const [apiRanking, setApiRanking] = useState([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [isLoadingHomeFeed, setIsLoadingHomeFeed] = useState(true);
  const [apiReviewOfDay, setApiReviewOfDay] = useState(
    FALLBACK_REVIEW_OF_THE_DAY,
  );
  const [apiTrendingSignals, setApiTrendingSignals] = useState(
    FALLBACK_TRENDING_SIGNALS,
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const leaderboardCategories = [
    { id: "playstore", label: "Play Store" },
    { id: "reddit", label: "Reddit" },
    { id: "price", label: "Price" },
  ];

  useEffect(() => {
    let isCancelled = false;

    async function loadLeaderboard() {
      setIsLoadingRanking(true);
      setApiRanking([]);

      try {
        const response = await fetch(
          `/api/leaderboard?category=${activeCategory}`,
        );

        if (!response.ok) {
          throw new Error("Leaderboard request failed");
        }

        const payload = await response.json();

        if (!isCancelled) {
          setApiRanking(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch {
        if (!isCancelled) {
          setApiRanking([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingRanking(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      isCancelled = true;
    };
  }, [activeCategory]);

  useEffect(() => {
    let isCancelled = false;

    async function loadHomeFeed() {
      try {
        const response = await fetch("/api/home-feed");

        if (!response.ok) {
          throw new Error("Home feed request failed");
        }

        const payload = await response.json();

        if (!isCancelled) {
          setApiReviewOfDay(normalizeReviewOfTheDay(payload.reviewOfTheDay));
          setApiTrendingSignals(
            normalizeTrendingSignals(payload.trendingSignals),
          );
        }
      } catch {
        if (!isCancelled) {
          setApiReviewOfDay(FALLBACK_REVIEW_OF_THE_DAY);
          setApiTrendingSignals(FALLBACK_TRENDING_SIGNALS);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingHomeFeed(false);
        }
      }
    }

    loadHomeFeed();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsReviewModalOpen(false);
      }
    }

    if (isReviewModalOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isReviewModalOpen]);

  const ranking = apiRanking;
  const liveReviewOfTheDay = apiReviewOfDay;
  const liveTrendingSignals = apiTrendingSignals;

  const handleShareCard = async () => {
    const topLines = ranking
      .slice(0, 5)
      .map(
        (platform) => `${platform.rank}. ${platform.name} (${platform.score})`,
      )
      .join("\n");

    const shareText = [
      "StrateStats Home Page",
      "Top 5 Platforms This Week",
      topLines,
      "",
      `Review of the Day: ${liveReviewOfTheDay.title}`,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "StrateStats Home Page",
          text: shareText,
          url: window.location.href,
        });
        toast.success("Shared successfully.");
        return;
      }

      await navigator.clipboard.writeText(
        `${shareText}\n${window.location.href}`,
      );
      toast.success("Card copied to clipboard.");
    } catch {
      toast.error("Unable to share right now.");
    }
  };

  return (
    <main className="site-shell page-block">
      <section className="leaderboard-wrap">
        <div className="premium-card leaderboard-card">
          <p className="eyebrow">Live Scorecard</p>
          <h1 className="leaderboard-title">Top 5 Platforms This Week</h1>
          <p>
            Easy-to-read rankings based on verified reviews, support quality,
            and Bharat coverage.
          </p>

          <div
            className="category-switcher"
            role="tablist"
            aria-label="Ranking category switcher"
          >
            {leaderboardCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`switch-chip ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="leaderboard-list">
            {isLoadingRanking
              ? Array.from({ length: 5 }, (_, index) => (
                  <article
                    key={`leader-skeleton-${index}`}
                    className="leader-row leader-row-skeleton"
                    aria-hidden="true"
                  >
                    <div className="skeleton-block skeleton-circle" />
                    <div className="leader-skeleton-body">
                      <div className="skeleton-block skeleton-line short" />
                      <div className="skeleton-block skeleton-line" />
                    </div>
                    <div className="skeleton-block skeleton-line tiny" />
                    <div className="skeleton-block skeleton-line small" />
                  </article>
                ))
              : null}
            {ranking.length === 0 && !isLoadingRanking ? (
              <p className="score-label">
                No platform data available yet. Run scrape to populate.
              </p>
            ) : null}
            {!isLoadingRanking
              ? ranking.map((platform) => (
                  <article key={platform.id} className="leader-row">
                    <div className="leader-rank">#{platform.rank}</div>
                    <div>
                      <h2>{platform.name}</h2>
                      <p className="score-label">
                        {activeCategory === "playstore"
                          ? `${platform.playStoreReviewCount} reviews | ${platform.coverage}`
                          : activeCategory === "reddit"
                            ? `${platform.redditReviewCount} reviews | ${platform.coverage}`
                            : activeCategory === "price"
                              ? `${platform.coverage}`
                              : `Support ${platform.support} | ${platform.coverage}`}
                      </p>
                    </div>
                    <div className="leader-score">
                      {activeCategory === "playstore" ? (
                        <span className="score-with-icon">
                          <PremiumStarBadge />
                          {Number(platform.score || 0).toFixed(1)}
                        </span>
                      ) : activeCategory === "price" ? (
                        `₹${Number(platform.score || 0).toLocaleString("en-IN")}`
                      ) : (
                        `${Number(platform.score || 0)}`
                      )}
                    </div>
                    <Link
                      href={`/platforms/${platform.id}`}
                      className="text-link compact"
                    >
                      View profile <ArrowRight size={14} />
                    </Link>
                  </article>
                ))
              : null}
          </div>
        </div>

        <aside className="premium-card review-day-card">
          {isLoadingHomeFeed ? (
            <div className="review-day-skeleton" aria-hidden="true">
              <div className="review-top">
                <div className="skeleton-block skeleton-pill" />
                <div className="skeleton-block skeleton-line tiny" />
              </div>
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line short" />
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line short" />
              <div className="hero-actions">
                <div className="skeleton-block skeleton-button" />
                <div className="skeleton-block skeleton-button" />
              </div>
            </div>
          ) : (
            <>
              <div className="review-top">
                <p className="card-tag">Review of the Day</p>
                <span>{liveReviewOfTheDay.date}</span>
              </div>
              <h2 className="compact-review-title">
                {shortenText(liveReviewOfTheDay.title, 72)}
              </h2>
              <p className="story-platform">{liveReviewOfTheDay.platform}</p>
              <p className="compact-review-text">
                {shortenText(liveReviewOfTheDay.story, 180)}
              </p>
              <p className="review-impact">{liveReviewOfTheDay.impact}</p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Read More <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={handleShareCard}
                >
                  <Share2 size={16} /> Share Card
                </button>
              </div>
            </>
          )}
        </aside>
      </section>

      <section className="premium-strip">
        <h2>Trending Signals</h2>
        <div className="card-grid two-up">
          {isLoadingHomeFeed
            ? Array.from({ length: 2 }, (_, index) => (
                <article
                  key={`trending-skeleton-${index}`}
                  className="story-card skeleton-card"
                  aria-hidden="true"
                >
                  <div className="signal-head">
                    <div className="skeleton-block skeleton-line short" />
                    <div className="skeleton-block skeleton-line tiny" />
                  </div>
                  <div className="skeleton-block skeleton-line" />
                  <div className="skeleton-block skeleton-line" />
                  <div className="skeleton-block skeleton-line short" />
                </article>
              ))
            : liveTrendingSignals.map((signal) => (
                <article
                  key={signal.id}
                  className={`story-card ${signal.sentiment}`}
                >
                  <div className="signal-head">
                    <p className="story-platform">
                      {signal.platform} | {signal.source}
                    </p>
                    <span className="score-label">{signal.ago}</span>
                  </div>
                  <p className="compact-signal-text">
                    {shortenText(signal.text, 120)}
                  </p>
                </article>
              ))}
        </div>
      </section>

      {isReviewModalOpen && liveReviewOfTheDay ? (
        <div
          className="archive-modal-backdrop"
          onClick={() => setIsReviewModalOpen(false)}
          role="presentation"
        >
          <article
            className="archive-modal-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
          >
            <header className="archive-modal-head">
              <div>
                <p className="card-tag">Review of the Day</p>
                <h2 id="review-modal-title">{liveReviewOfTheDay.title}</h2>
                <p className="score-label">
                  {liveReviewOfTheDay.platform} | {liveReviewOfTheDay.date}
                </p>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setIsReviewModalOpen(false)}
                aria-label="Close review modal"
              >
                <X size={16} /> Close
              </button>
            </header>

            <p className="review-modal-story">{liveReviewOfTheDay.story}</p>
            <p className="review-impact">{liveReviewOfTheDay.impact}</p>

            <div className="hero-actions">
              <Link href="/review-archive" className="text-link">
                Open full archive <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}
