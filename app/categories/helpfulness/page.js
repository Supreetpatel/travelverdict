import { getRankedCategory } from "@/lib/db-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  description: "Booking friction, transparency, and mobile experience audits.",
};

export default async function HelpfulnessDeepDivePage() {
  const ranking = await getRankedCategory("helpfulness");

  const audits = [
    {
      metric: "Price transparency",
      note: "How clearly final pricing is shown before payment and whether there are hidden fees in checkout.",
    },
    {
      metric: "Booking friction",
      note: "Ease of completing bookings with smooth form flows and minimal required steps.",
    },
    {
      metric: "Mobile experience",
      note: "Quality of booking flows on mobile devices, especially on lower bandwidth networks.",
    },
  ];

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Category Deep-Dive</p>
        <h1>Helpfulness Deep-Dive</h1>
        <p>
          How easy booking feels in practice: pricing honesty, friction points,
          and mobile checkout confidence.
        </p>
      </section>

      <section className="card-grid three-up">
        {audits.map((audit) => (
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
