import { getRankedCategory } from "@/lib/db-ui";
import BackButton from "@/app/components/back-button";
import { ShieldCheck, Smartphone, Workflow } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  description:
    "Reliability ranking based on consistency and platform stability.",
};

export default async function RelatabilityDeepDivePage() {
  const ranking = await getRankedCategory("relatability");

  const highlights = [
    {
      title: "Booking Consistency",
      detail:
        "How reliably users can complete bookings without dropped sessions or broken flows.",
      icon: Workflow,
    },
    {
      title: "Technical Stability",
      detail:
        "Signals from crashes, failures, and reliability complaints in real user reviews.",
      icon: Smartphone,
    },
    {
      title: "Trust Under Load",
      detail:
        "How dependable platforms remain during high demand periods and edge-case bookings.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <BackButton fallbackHref="/categories" label="Back" />
        <p className="eyebrow">Category Deep-Dive</p>
        <h1>Reliability Deep-Dive</h1>
        <p>
          Reliability ranking based on current consistency and stability signals
          stored in the database.
        </p>
      </section>

      <section className="premium-card category-dive-hero">
        <p className="eyebrow">What This Measures</p>
        <h2>Reliability under real booking pressure</h2>
        <p>
          This category captures technical resilience and flow consistency so
          users can trust that bookings succeed when it matters most.
        </p>
      </section>

      <section className="card-grid three-up category-dive-highlights">
        {highlights.map((item) => (
          <article key={item.title} className="premium-card category-dive-card">
            <div className="category-dive-card-head">
              <span className="category-path-icon" aria-hidden="true">
                <item.icon size={17} />
              </span>
              <p className="card-tag">Reliability Signal</p>
            </div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="premium-card category-leaderboard-card">
        <p className="eyebrow">Live Category Ranking</p>
        <h2>Live Reliability Rankings</h2>
        <div className="leaderboard-list">
          {ranking.map((item, index) => (
            <article key={item.name} className="leader-row">
              <div className="leader-rank">#{index + 1}</div>
              <h3>{item.name}</h3>
              <p className="score-label">
                Database-ranked reliability performance
              </p>
              <div className="leader-score">{item.score}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
