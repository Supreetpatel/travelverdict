import { getRankedCategory } from "@/lib/db-ui";
import BackButton from "@/app/components/back-button";
import { HeartHandshake, Sparkles, WalletCards } from "lucide-react";

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
      icon: WalletCards,
    },
    {
      metric: "Booking friction",
      note: "Ease of completing bookings with smooth form flows and minimal required steps.",
      icon: Sparkles,
    },
    {
      metric: "Mobile experience",
      note: "Quality of booking flows on mobile devices, especially on lower bandwidth networks.",
      icon: HeartHandshake,
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

      <section className="premium-card category-dive-hero">
        <p className="eyebrow">What This Measures</p>
        <h2>Sentiment, delight, and confidence in user journeys</h2>
        <p>
          Happiness combines emotional sentiment and practical usability signals
          to reflect how users actually feel after interacting with a platform.
        </p>
      </section>

      <section className="card-grid three-up category-dive-highlights">
        {audits.map((audit) => (
          <article
            key={audit.metric}
            className="premium-card category-dive-card"
          >
            <div className="category-dive-card-head">
              <span className="category-path-icon" aria-hidden="true">
                <audit.icon size={17} />
              </span>
              <p className="card-tag">Audit Insight</p>
            </div>
            <h3>{audit.metric}</h3>
            <p>{audit.note}</p>
          </article>
        ))}
      </section>

      <section className="premium-card category-leaderboard-card">
        <p className="eyebrow">Live Category Ranking</p>
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
