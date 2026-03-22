import { getWeeklyRoundupData } from "@/lib/db-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  description:
    "Weekly score movements and stat of the week in newsletter format.",
};

export default async function WeeklyRoundupPage() {
  const weeklyRoundup = await getWeeklyRoundupData();

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Weekly Roundup</p>
        <h1>Score movements for {weeklyRoundup.weekLabel}</h1>
        <p>
          Biggest gainers, biggest drops, and what changed this week across
          major travel platforms.
        </p>
      </section>

      <section className="premium-strip">
        <p className="eyebrow">Stat of the Week</p>
        <h2>{weeklyRoundup.statOfTheWeek}</h2>
      </section>

      <section className="premium-card">
        <h2>Score Movements</h2>
        <div className="leaderboard-list">
          {weeklyRoundup.movements.map((movement) => (
            <article key={movement.platform} className="leader-row">
              <h3>{movement.platform}</h3>
              <p className="score-label">{movement.reason}</p>
              <div
                className={`movement-chip ${movement.delta > 0 ? "up" : "down"}`}
              >
                {movement.delta > 0 ? `+${movement.delta}` : movement.delta}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
