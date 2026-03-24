export default function CompareLoading() {
  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <div className="skeleton-block skeleton-line tiny" />
        <div className="skeleton-block skeleton-line short" />
        <div className="skeleton-block skeleton-line" />
      </section>

      <section className="premium-card" aria-hidden="true">
        <div className="compare-selectors" style={{ marginBottom: "1rem" }}>
          <div className="skeleton-block" style={{ height: "46px" }} />
          <div className="skeleton-block" style={{ height: "46px" }} />
        </div>
        <div className="card-grid three-up">
          {Array.from({ length: 3 }, (_, index) => (
            <article key={`compare-skeleton-${index}`} className="premium-card">
              <div className="skeleton-block skeleton-pill" />
              <div
                className="skeleton-block"
                style={{ height: "42px", marginTop: "0.6rem" }}
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
