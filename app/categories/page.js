import Link from "next/link";
import {
  ArrowRight,
  Headset,
  ShieldCheck,
  Smile,
  Sparkles,
} from "lucide-react";
import BackButton from "../components/back-button";

export const metadata = {
  description: "Explore Support, Reliability, and Happiness deep-dive pages.",
};

const categoryCards = [
  {
    href: "/categories/support",
    title: "Support",
    icon: Headset,
    pillar: "Service Recovery",
    detail:
      "Monthly support tests, first-response speed, and escalation quality leaderboards.",
  },
  {
    href: "/categories/relatability",
    title: "Reliability",
    icon: ShieldCheck,
    pillar: "Booking Confidence",
    detail:
      "Platform reliability rankings focused on booking consistency and technical stability.",
  },
  {
    href: "/categories/helpfulness",
    title: "Happiness",
    icon: Smile,
    pillar: "Delight Signals",
    detail:
      "Customer happiness trends from social tags, positive reactions, and sentiment.",
  },
];

const sourceRules = [
  {
    metric: "Reliability",
    source: "Play Store",
    note: "Users report technical bugs, booking failures, and app crashes here first.",
  },
  {
    metric: "Happiness",
    source: "Play Store",
    note: "Review text and ratings reveal delight signals, onboarding clarity, and perceived value.",
  },
  {
    metric: "Support",
    source: "Reddit",
    note: "This is where users go for long-form horror stories about refunds and customer service.",
  },
];

export default function CategoriesIndexPage() {
  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <BackButton fallbackHref="/" label="Back" />
        <p className="eyebrow">Category Deep-Dives</p>
        <h1>Choose the quality lens you want to evaluate.</h1>
        <p>
          Open focused deep-dives for Support, Reliability, and Happiness to
          understand exactly why platform scores rise or drop.
        </p>
      </section>

      <section className="premium-card category-hero-card">
        <div className="category-hero-head">
          <p className="eyebrow">How It Works</p>
          <span className="category-hero-chip">
            <Sparkles size={14} /> Weekly updated signals
          </span>
        </div>
        <h2>From raw feedback to actionable category scores</h2>
        <p>
          Each category blends verified review evidence, credibility weighting,
          and platform-level trend signals so you can compare services with
          context, not just a single number.
        </p>
      </section>

      <section className="card-grid three-up category-cards-grid">
        {categoryCards.map((item) => (
          <article key={item.href} className="premium-card category-path-card">
            <div className="category-path-head">
              <span className="category-path-icon" aria-hidden="true">
                <item.icon size={18} />
              </span>
              <p className="card-tag">{item.pillar}</p>
            </div>
            <h2>{item.title} Deep-Dive</h2>
            <p>{item.detail}</p>
            <Link href={item.href} className="text-link category-path-link">
              Open {item.title} <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </section>

      <section className="premium-card category-source-card">
        <p className="eyebrow">Signal Sources</p>
        <h2>Metric to source intelligence mapping</h2>
        <div className="leaderboard-list">
          {sourceRules.map((rule) => (
            <article key={rule.metric} className="category-source-row">
              <div>
                <h3>{rule.metric}</h3>
                <p className="score-label">Primary source: {rule.source}</p>
              </div>
              <p>{rule.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
