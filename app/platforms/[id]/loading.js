export default function PlatformLoading() {
  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <div className="skeleton-block skeleton-line tiny" />
        <div className="skeleton-block skeleton-line short" />
        <div className="skeleton-block skeleton-line" />
      </section>

      <section className="card-grid three-up profile-stat-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <article
            key={`profile-top-skeleton-${index}`}
            className="premium-card profile-stat-card"
            aria-hidden="true"
          >
            <div className="profile-stat-head">
              <div className="skeleton-block skeleton-pill" />
              <div className="skeleton-block skeleton-circle" />
            </div>
            <div className="skeleton-block skeleton-line short" />
          </article>
        ))}
      </section>

      <section className="card-grid three-up profile-stat-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <article
            key={`profile-score-skeleton-${index}`}
            className="premium-card profile-stat-card"
            aria-hidden="true"
          >
            <div className="profile-stat-head">
              <div className="skeleton-block skeleton-pill" />
              <div className="skeleton-block skeleton-circle" />
            </div>
            <div className="skeleton-block skeleton-line short" />
          </article>
        ))}
      </section>

      <section className="premium-card" aria-hidden="true">
        <div className="skeleton-block skeleton-line tiny" />
        <div className="skeleton-block skeleton-line short" />
        <div
          className="skeleton-block"
          style={{ height: "220px", marginTop: "0.7rem" }}
        />
      </section>
    </main>
  );
}
