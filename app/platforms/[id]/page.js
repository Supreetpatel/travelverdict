import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileReviewFeed from "../../components/profile-review-feed";
import BackButton from "../../components/back-button";
import { getPlatformProfile, getPlatformSlugs } from "@/lib/db-ui";

export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelverdict.vercel.app";

function buildAbsoluteUrl(pathname) {
  return new URL(pathname, SITE_URL).toString();
}

function ScoreHistoryChart({ values }) {
  const pointsSource = Array.isArray(values)
    ? values.filter((item) => Number.isFinite(item))
    : [];
  const normalizedValues =
    pointsSource.length > 1
      ? pointsSource
      : pointsSource.length === 1
        ? [pointsSource[0], pointsSource[0]]
        : [50, 50];

  const width = 680;
  const height = 220;
  const padding = 28;
  const minValue = Math.min(...normalizedValues);
  const maxValue = Math.max(...normalizedValues);
  const edgePadding = minValue === maxValue ? 4 : 2;
  const min = minValue - edgePadding;
  const max = maxValue + edgePadding;
  const stepX = (width - padding * 2) / (normalizedValues.length - 1);
  const range = max - min || 1;

  const points = normalizedValues
    .map((value, index) => {
      const x = padding + index * stepX;
      const ratio = (value - min) / range;
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
      {normalizedValues.map((value, index) => {
        const x = padding + index * stepX;
        const ratio = (value - min) / range;
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
    return {
      title: "Platform Not Found | StrateStats",
      description:
        "Explore independent travel platform scorecards with category breakdowns and verified reviews.",
    };
  }

  const profileUrl = buildAbsoluteUrl(`/platforms/${platform.id}`);
  const title = `${platform.name} Platform Profile | StrateStats`;
  const description = `${platform.name} quality profile with composite score ${platform.scores.composite}, category-level breakdowns, verified reviews, and Bharat coverage insights.`;

  return {
    title,
    description,
    alternates: {
      canonical: profileUrl,
    },
    keywords: [
      `${platform.name} reviews`,
      `${platform.name} support score`,
      `${platform.name} reliability score`,
      "travel platform scorecard",
      "Indian travel platform ranking",
    ],
    openGraph: {
      title,
      description,
      url: profileUrl,
      type: "article",
      siteName: "StrateStats",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PlatformProfilePage({ params }) {
  const route = await params;
  const platform = await getPlatformProfile(route.id);

  if (!platform) {
    notFound();
  }

  const profileUrl = buildAbsoluteUrl(`/platforms/${platform.id}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: platform.name,
    brand: {
      "@type": "Brand",
      name: platform.name,
    },
    description:
      "Independent travel platform profile with composite and category-level quality scores.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: platform.scores.composite,
      bestRating: 100,
      worstRating: 0,
      ratingCount: platform.verifiedReviews.length,
    },
    url: profileUrl,
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="page-intro">
        <BackButton fallbackHref="/leaderboard" label="Back" />
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
          <Link href="/categories" className="ghost-button">
            Categories
          </Link>
        </div>
      </section>
    </main>
  );
}
