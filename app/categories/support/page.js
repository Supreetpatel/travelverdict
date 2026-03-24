import { getRankedCategory } from "@/lib/db-ui";
import BackButton from "@/app/components/back-button";
import { Clock3, Headset, MessageCircleWarning } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  description: "Monthly support tests and response-time leaderboard.",
};

export default async function SupportDeepDivePage() {
  const ranking = await getRankedCategory("support");

  const highlights = [
    {
      title: "First Response Speed",
      detail:
        "How quickly users get an initial human response after raising an issue.",
      icon: Clock3,
    },
    {
      title: "Escalation Quality",
      detail:
        "How effectively unresolved tickets are escalated and followed through to closure.",
      icon: MessageCircleWarning,
    },
    {
      title: "Support Experience",
      detail:
        "How users describe empathy, clarity, and ownership during support interactions.",
      icon: Headset,
    },
  ];

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <BackButton fallbackHref="/categories" label="Back" />
        <p className="eyebrow">Category Deep-Dive</p>
        <h1>Support Deep-Dive</h1>
        <p>
          Live support rankings derived from current platform support scores in
          the database.
        </p>
      </section>

      <section className="premium-card category-dive-hero">
        <p className="eyebrow">What This Measures</p>
        <h2>Service recovery strength and support execution quality</h2>
        <p>
          This category focuses on response speed, escalation handling, and how
          reliably platforms resolve user pain points when things go wrong.
        </p>
      </section>

      <section className="card-grid three-up category-dive-highlights">
        {highlights.map((item) => (
          <article key={item.title} className="premium-card category-dive-card">
            <div className="category-dive-card-head">
              <span className="category-path-icon" aria-hidden="true">
                <item.icon size={17} />
              </span>
              <p className="card-tag">Support Signal</p>
            </div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="premium-card category-leaderboard-card">
        <p className="eyebrow">Live Category Ranking</p>
        <h2>Monthly Support Test Leaderboard</h2>
        <div className="leaderboard-list">
          {ranking.map((item, index) => (
            <article key={item.name} className="leader-row">
              <div className="leader-rank">#{index + 1}</div>
              <h3>{item.name}</h3>
              <p className="score-label">Database-ranked support performance</p>
              <div className="leader-score">{item.score}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
