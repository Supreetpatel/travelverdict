"use client";

import {
  ArrowRight,
  BadgeCheck,
  MessageSquareWarning,
  Share2,
  X,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function shortenText(value, maxLength) {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("playstore");
  const [apiRanking, setApiRanking] = useState([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [apiReviewOfDay, setApiReviewOfDay] = useState(null);
  const [apiTrendingSignals, setApiTrendingSignals] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const leaderboardCategories = [
    { id: "playstore", label: "Play Store" },
    { id: "reddit", label: "Reddit" },
    { id: "instagram", label: "Instagram" },
  ];

  useEffect(() => {
    let isCancelled = false;

    async function loadLeaderboard() {
      setIsLoadingRanking(true);

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
          setApiReviewOfDay(payload.reviewOfTheDay ?? null);
          setApiTrendingSignals(
            Array.isArray(payload.trendingSignals)
              ? payload.trendingSignals
              : [],
          );
        }
      } catch {
        if (!isCancelled) {
          setApiReviewOfDay(null);
          setApiTrendingSignals([]);
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
            {isLoadingRanking && !ranking.length ? (
              <p className="score-label">Refreshing live leaderboard...</p>
            ) : null}
            {ranking.length === 0 && !isLoadingRanking ? (
              <p className="score-label">
                No platform data available yet. Run scrape to populate.
              </p>
            ) : null}
            {ranking.map((platform) => (
              <article key={platform.id} className="leader-row">
                <div className="leader-rank">#{platform.rank}</div>
                <div>
                  <h2>{platform.name}</h2>
                  <p className="score-label">
                    {activeCategory === "playstore"
                      ? `${platform.playStoreReviewCount} reviews | ${platform.coverage}`
                      : activeCategory === "reddit"
                        ? `${platform.redditReviewCount} reviews | ${platform.coverage}`
                        : activeCategory === "instagram"
                          ? `${platform.instagramReviewCount} reviews | ${platform.coverage}`
                          : `Support ${platform.support} | ${platform.coverage}`}
                  </p>
                </div>
                <div className="leader-score">
                  {activeCategory === "playstore"
                    ? `${platform.score}⭐`
                    : activeCategory === "reddit"
                      ? `${platform.score}/100`
                      : activeCategory === "instagram"
                        ? `${platform.score}/100`
                        : platform.score}
                </div>
                <Link
                  href={`/platforms/${platform.id}`}
                  className="text-link compact"
                >
                  View profile <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="premium-card review-day-card">
          {liveReviewOfTheDay ? (
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
          ) : (
            <p className="score-label">
              No recent reviews yet. Run scrape to populate.
            </p>
          )}
        </aside>
      </section>

      <section className="premium-strip">
        <h2>Trending Signals</h2>
        <div className="card-grid two-up">
          {liveTrendingSignals.map((signal) => (
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

      <section className="card-grid three-up">
        <article className="premium-card metric-card">
          <div className="metric-icon">
            <BadgeCheck size={24} />
          </div>
          <h2>Platform Profiles</h2>
          <p>
            See score details, review sources, quality trend, and coverage map.
          </p>
          <Link href="/platforms/aorta-rooms" className="text-link">
            Open sample profile <ArrowRight size={16} />
          </Link>
        </article>
        <article className="premium-card metric-card">
          <div className="metric-icon">
            <MessageSquareWarning size={24} />
          </div>
          <h2>Compare Tool</h2>
          <p>Compare two platforms side by side with use-case filters.</p>
          <Link href="/compare" className="text-link">
            Compare now <ArrowRight size={16} />
          </Link>
        </article>
        <article className="premium-card metric-card">
          <div className="metric-icon">
            <BadgeCheck size={24} />
          </div>
          <h2>Categories</h2>
          <p>Explore Support, Reliability, and Happiness deep-dive pages.</p>
          <Link href="/categories" className="text-link">
            Open categories <ArrowRight size={16} />
          </Link>
        </article>
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
