import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileReviewFeed from "../../components/profile-review-feed";
import { getPlatformProfile, getPlatformSlugs } from "@/lib/db-ui";

export const revalidate = 0;

function ScoreHistoryChart({ values }) {
  const width = 680;
  const height = 220;
  const padding = 28;
  const min = Math.min(...values) - 2;
  const max = Math.max(...values) + 2;
  const stepX = (width - padding * 2) / (values.length - 1);

  const points = values
    .map((value, index) => {
      const x = padding + index * stepX;
      const ratio = (value - min) / (max - min);
      const y = height - padding - ratio * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="history-chart"
      role="img"
      aria-label="12 month score history chart"
    >
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="18"
        className="chart-bg"
      />
      <polyline points={points} fill="none" className="chart-line" />
      {values.map((value, index) => {
        const x = padding + index * stepX;
        const ratio = (value - min) / (max - min);
        const y = height - padding - ratio * (height - padding * 2);
        return (
          <circle
            key={`${value}-${index}`}
            cx={x}
            cy={y}
            r="3.5"
            className="chart-dot"
          />
        );
      })}
    </svg>
  );
}

export async function generateStaticParams() {
  const slugs = await getPlatformSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }) {
  const route = await params;
  const platform = await getPlatformProfile(route.id);

  if (!platform) {
    return { title: "StrateStats" };
  }

  return {
    title: platform.name,
    description: `Score breakdown and verified reviews for ${platform.name}.`,
  };
}

export default async function PlatformProfilePage({ params }) {
  const route = await params;
  const platform = await getPlatformProfile(route.id);

  if (!platform) {
    notFound();
  }

  const scoreCards = [
    {
      key: "helpfulness",
      label: "Happiness",
      score: platform.scores.helpfulness,
    },
    { key: "support", label: "Support", score: platform.scores.support },
    {
      key: "relatability",
      label: "Reliability",
      score: platform.scores.relatability,
    },
  ];

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Platform Profile</p>
        <h1>{platform.name}</h1>
        <p>
          Composite score {platform.scores.composite} with detailed category
          gauges, verified reviews, and Bharat coverage map.
        </p>
      </section>

      <section className="card-grid three-up">
        {scoreCards.map((item) => (
          <article key={item.key} className="premium-card">
            <p className="card-tag">{item.label}</p>
            <p className="score-number">{item.score}</p>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${item.score}%` }} />
            </div>
          </article>
        ))}
      </section>

      <section className="premium-card">
        <p className="eyebrow">Score History Chart</p>
        <h2>12-Month Quality Trend</h2>
        <ScoreHistoryChart values={platform.history} />
      </section>

      <ProfileReviewFeed reviews={platform.verifiedReviews} />

      {platform.bharatCoverage?.length ? (
        <section className="premium-card">
          <p className="eyebrow">Bharat Coverage Map</p>
          <h2>Tier 2 and Tier 3 presence quality</h2>
          <div className="map-grid">
            {platform.bharatCoverage.map((city) => (
              <article key={city.city} className="map-cell">
                <p className="story-platform">{city.tier}</p>
                <h3>{city.city}</h3>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${city.coverage}%` }}
                  />
                </div>
                <p className="score-label">Coverage quality {city.coverage}</p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="premium-card">
          <p className="eyebrow">Coverage Signal</p>
          <h2>{platform.cityCoverage}</h2>
          <p>
            Region-level coverage maps will appear here as soon as city-tier
            ingestion is enabled for this platform.
          </p>
        </section>
      )}

      <section className="premium-card">
        <p className="eyebrow">Explore More</p>
        <div className="hero-actions">
          <Link href="/compare" className="cta-button">
            Compare Platforms
          </Link>
          <Link href="/weekly-roundup" className="ghost-button">
            Weekly Roundup
          </Link>
        </div>
      </section>
    </main>
  );
}
