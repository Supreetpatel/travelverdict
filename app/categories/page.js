import Link from "next/link";
import BackButton from "../components/back-button";

export const metadata = {
  description: "Explore Support, Reliability, and Happiness deep-dive pages.",
};

const categoryCards = [
  {
    href: "/categories/support",
    title: "Support",
    detail:
      "Monthly support tests, first-response speed, and escalation quality leaderboards.",
  },
  {
    href: "/categories/relatability",
    title: "Reliability",
    detail:
      "Platform reliability rankings focused on booking consistency and technical stability.",
  },
  {
    href: "/categories/helpfulness",
    title: "Happiness",
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
    source: "Instagram",
    note: "Users tag brands in photos and Reels. High Happiness means high tags and positive emojis.",
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
        <h1>Choose what you want to evaluate.</h1>
        <p>
          Open a focused view for Support, Reliability, or Happiness to
          understand why platform scores move.
        </p>
      </section>

      <section className="card-grid three-up">
        {categoryCards.map((item) => (
          <article key={item.href} className="premium-card metric-card">
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
            <Link href={item.href} className="text-link">
              Open {item.title}
            </Link>
          </article>
        ))}
      </section>

      <section className="premium-card">
        <p className="eyebrow">Signal Sources</p>
        <h2>Metric to source mapping</h2>
        <div className="leaderboard-list">
          {sourceRules.map((rule) => (
            <article key={rule.metric} className="leader-row">
              <h3>{rule.metric}</h3>
              <p className="score-label">Source: {rule.source}</p>
              <p>{rule.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
