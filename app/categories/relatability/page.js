import { getRankedCategory } from "@/lib/db-ui";

export const metadata = {
  description: "Language support and Built for Bharat rankings.",
};

export default async function RelatabilityDeepDivePage() {
  const ranking = await getRankedCategory("relatability");

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Category Deep-Dive</p>
        <h1>Relatability Deep-Dive</h1>
        <p>
          Built for Bharat ranking based on current relatability scores stored
          in the database.
        </p>
      </section>

      <section className="premium-card">
        <h2>Built for Bharat Rankings</h2>
        <div className="leaderboard-list">
          {ranking.map((item, index) => (
            <article key={item.name} className="leader-row">
              <div className="leader-rank">#{index + 1}</div>
              <h3>{item.name}</h3>
              <p className="score-label">
                Language support and cultural fit index
              </p>
              <div className="leader-score">{item.score}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
