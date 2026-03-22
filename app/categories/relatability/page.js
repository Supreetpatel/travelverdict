import { getRankedCategory } from "@/lib/db-ui";
import BackButton from "@/app/components/back-button";

export const dynamic = "force-dynamic";

export const metadata = {
  description:
    "Reliability ranking based on consistency and platform stability.",
};

export default async function RelatabilityDeepDivePage() {
  const ranking = await getRankedCategory("relatability");

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

      <section className="premium-card">
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
