import { getRankedCategory } from "@/lib/db-ui";
import BackButton from "@/app/components/back-button";

export const dynamic = "force-dynamic";

export const metadata = {
  description:
    "Happiness trends from sentiment, social signals, and user delight.",
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
        <BackButton fallbackHref="/categories" label="Back" />
        <p className="eyebrow">Category Deep-Dive</p>
        <h1>Happiness Deep-Dive</h1>
        <p>
          How happy users feel in practice: positive sentiment, delight cues,
          and confidence in the overall booking experience.
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
        <h2>Live Happiness Rankings</h2>
        <div className="leaderboard-list">
          {ranking.map((item, index) => (
            <article key={item.name} className="leader-row">
              <div className="leader-rank">#{index + 1}</div>
              <h3>{item.name}</h3>
              <p className="score-label">Database-ranked user happiness</p>
              <div className="leader-score">{item.score}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
