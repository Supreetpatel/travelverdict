"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import CustomDropdown from "./custom-dropdown";

const useCaseWeights = {
  Business: { helpfulness: 0.4, support: 0.4, relatability: 0.2 },
  Family: { helpfulness: 0.3, support: 0.35, relatability: 0.35 },
  Pilgrimage: { helpfulness: 0.25, support: 0.3, relatability: 0.45 },
};

export default function CompareTool({ platforms }) {
  const hasEnoughPlatforms = platforms.length >= 2;
  const [leftId, setLeftId] = useState(platforms[0]?.id ?? "");
  const [rightId, setRightId] = useState(platforms[1]?.id ?? "");
  const [useCase, setUseCase] = useState("Business");

  const handleLeftChange = (nextId) => {
    if (nextId === rightId) {
      toast.error("Choose a different app for Platform A and Platform B.");
      return;
    }
    setLeftId(nextId);
  };

  const handleRightChange = (nextId) => {
    if (nextId === leftId) {
      toast.error("Choose a different app for Platform A and Platform B.");
      return;
    }
    setRightId(nextId);
  };

  const left =
    platforms.find((platform) => platform.id === leftId) ??
    platforms[0] ??
    null;
  const right =
    platforms.find((platform) => platform.id === rightId) ??
    platforms[1] ??
    null;

  const verdict = useMemo(() => {
    if (!left || !right) {
      return "Add at least two apps to start comparison.";
    }

    const weights = useCaseWeights[useCase];
    const weighted = (platform) =>
      Math.round(
        platform.scores.helpfulness * weights.helpfulness +
          platform.scores.support * weights.support +
          platform.scores.relatability * weights.relatability,
      );

    const leftScore = weighted(left);
    const rightScore = weighted(right);
    const diff = Math.abs(leftScore - rightScore);

    if (leftScore === rightScore) {
      return `For ${useCase} trips, both platforms are tied at ${leftScore}.`;
    }

    const winner = leftScore > rightScore ? left.name : right.name;
    return `${winner} is ${diff} points better for ${useCase.toLowerCase()} travel in Tier 2 and Tier 3 cities.`;
  }, [left, right, useCase]);

  if (!hasEnoughPlatforms) {
    return (
      <section className="premium-card">
        <p className="eyebrow">Compare Tool</p>
        <h2>Add at least two apps to compare.</h2>
        <p>
          The comparison view supports exactly two apps at a time and requires
          two distinct options.
        </p>
      </section>
    );
  }

  return (
    <section className="page-block">
      <section className="premium-card">
        <p className="eyebrow">Use Case Filters</p>
        <div className="category-switcher">
          {Object.keys(useCaseWeights).map((item) => (
            <button
              key={item}
              type="button"
              className={`switch-chip compare-usecase-chip ${useCase === item ? "active" : ""}`}
              onClick={() => setUseCase(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="premium-card compare-selectors">
        <CustomDropdown
          label="Platform A"
          value={leftId}
          onChange={handleLeftChange}
          options={platforms.map((platform) => ({
            value: platform.id,
            label: platform.name,
          }))}
        />
        <CustomDropdown
          label="Platform B"
          value={rightId}
          onChange={handleRightChange}
          options={platforms.map((platform) => ({
            value: platform.id,
            label: platform.name,
          }))}
        />
      </section>

      <section className="card-grid two-up">
        {[left, right].map((platform, idx) => (
          <article key={`${platform.id}-${idx}`} className="premium-card">
            <p className="card-tag">
              {idx === 0 ? "Platform A" : "Platform B"}
            </p>
            <h2>{platform.name}</h2>
            <ul className="compare-bars">
              <li>
                <span>Happiness</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${platform.scores.helpfulness}%` }}
                  />
                </div>
                <strong>{platform.scores.helpfulness}</strong>
              </li>
              <li>
                <span>Support</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${platform.scores.support}%` }}
                  />
                </div>
                <strong>{platform.scores.support}</strong>
              </li>
              <li>
                <span>Reliability</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${platform.scores.relatability}%` }}
                  />
                </div>
                <strong>{platform.scores.relatability}</strong>
              </li>
            </ul>
          </article>
        ))}
      </section>

      <section className="premium-strip verdict-banner">
        <p className="eyebrow">The Verdict</p>
        <p className="verdict-text">{verdict}</p>
      </section>
    </section>
  );
}
