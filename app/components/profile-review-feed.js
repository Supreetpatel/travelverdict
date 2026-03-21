"use client";

import { useMemo, useState } from "react";

export default function ProfileReviewFeed({ reviews }) {
  const [source, setSource] = useState("All");
  const normalizedReviews = reviews.map((review) => ({
    ...review,
    source: review.source === "PLAY_STORE" ? "App Store" : review.source,
  }));

  const visible = useMemo(() => {
    if (source === "All") {
      return normalizedReviews;
    }
    return normalizedReviews.filter((item) => item.source === source);
  }, [normalizedReviews, source]);

  const options = ["All", "Reddit", "X", "App Store"];

  return (
    <section className="premium-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Verified Review Feed</p>
          <h2>Filter by source</h2>
        </div>
        <div className="category-switcher">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`switch-chip ${source === option ? "active" : ""}`}
              onClick={() => setSource(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid two-up">
        {visible.length ? (
          visible.map((review, index) => (
            <article
              key={`${review.source}-${index}`}
              className={`story-card ${review.tone}`}
            >
              <div className="signal-head">
                <p className="story-platform">{review.source}</p>
                <span className="score-label">{review.date}</span>
              </div>
              <p>{review.summary}</p>
            </article>
          ))
        ) : (
          <p className="archive-empty">
            No reviews available for this source yet.
          </p>
        )}
      </div>
    </section>
  );
}
