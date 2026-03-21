import { deepDives } from "../../data";
import { getRankedCategory } from "@/lib/db-ui";

export const metadata = {
  description: "Booking friction, transparency, and mobile experience audits.",
};

export default async function HelpfulnessDeepDivePage() {
  const content = deepDives.helpfulness;
  const ranking = await getRankedCategory("helpfulness");

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Category Deep-Dive</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </section>

      <section className="card-grid three-up">
        {content.audits.map((audit) => (
          <article key={audit.metric} className="premium-card">
            <p className="card-tag">Audit Insight</p>
            <h2>{audit.metric}</h2>
            <p>{audit.note}</p>
          </article>
        ))}
      </section>

      <section className="premium-card">
        <h2>Live Helpfulness Rankings</h2>
        <div className="leaderboard-list">
          {ranking.map((item, index) => (
            <article key={item.name} className="leader-row">
              <div className="leader-rank">#{index + 1}</div>
              <h3>{item.name}</h3>
              <p className="score-label">Database-ranked booking usability</p>
              <div className="leader-score">{item.score}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
