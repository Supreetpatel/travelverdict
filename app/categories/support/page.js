import { getRankedCategory } from "@/lib/db-ui";

export const metadata = {
  description: "Monthly support tests and response-time leaderboard.",
};

export default async function SupportDeepDivePage() {
  const ranking = await getRankedCategory("support");

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Category Deep-Dive</p>
        <h1>Support Deep-Dive</h1>
        <p>
          Live support rankings derived from current platform support scores in
          the database.
        </p>
      </section>

      <section className="premium-card">
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
