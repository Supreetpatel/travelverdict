"use client";

import {
  ArrowRight,
  BadgeCheck,
  MessageSquareWarning,
  Share2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  leaderboardCategories,
  rankedBy,
  reviewOfTheDay,
  trendingSignals,
} from "./data";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("composite");
  const [apiRanking, setApiRanking] = useState([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [apiReviewOfDay, setApiReviewOfDay] = useState(null);
  const [apiTrendingSignals, setApiTrendingSignals] = useState([]);

  const fallbackRanking = useMemo(
    () => rankedBy(activeCategory),
    [activeCategory],
  );

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

  const ranking = apiRanking.length ? apiRanking : fallbackRanking;
  const liveReviewOfTheDay = apiReviewOfDay ?? reviewOfTheDay;
  const liveTrendingSignals = apiTrendingSignals.length
    ? apiTrendingSignals
    : trendingSignals;

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
        <div className="premium-card">
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
            {isLoadingRanking ? (
              <p className="score-label">Refreshing live leaderboard...</p>
            ) : null}
            {ranking.map((platform) => (
              <article key={platform.id} className="leader-row">
                <div className="leader-rank">#{platform.rank}</div>
                <div>
                  <h2>{platform.name}</h2>
                  <p className="score-label">
                    Support {platform.support} | {platform.coverage}
                  </p>
                </div>
                <div className="leader-score">{platform.score}</div>
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
          <div className="review-top">
            <p className="card-tag">Review of the Day</p>
            <span>{liveReviewOfTheDay.date}</span>
          </div>
          <h2>{liveReviewOfTheDay.title}</h2>
          <p className="story-platform">{liveReviewOfTheDay.platform}</p>
          <p>{liveReviewOfTheDay.story}</p>
          <p className="review-impact">{liveReviewOfTheDay.impact}</p>
          <div className="hero-actions">
            <Link href="/review-archive" className="cta-button">
              Read Full Story <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              className="ghost-button"
              onClick={handleShareCard}
            >
              <Share2 size={16} /> Share Card
            </button>
          </div>
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
              <p>{signal.text}</p>
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
            <Sparkles size={24} />
          </div>
          <h2>Weekly Roundup</h2>
          <p>Quick summary of weekly score changes and one key stat.</p>
          <Link href="/weekly-roundup" className="text-link">
            Read weekly roundup <ArrowRight size={16} />
          </Link>
        </article>
      </section>
    </main>
  );
}
