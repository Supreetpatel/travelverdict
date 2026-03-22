"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BackButton from "./back-button";

export default function ReviewArchiveClient({ reviewArchive, patternReports }) {
  const [query, setQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const safeArchive = reviewArchive ?? [];
  const safeReports = patternReports ?? [];

  const sortedArchive = useMemo(() => {
    const toTimestamp = (value) => {
      const parsed = Date.parse(value ?? "");
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    return [...safeArchive].sort(
      (a, b) => toTimestamp(b.date) - toTimestamp(a.date),
    );
  }, [safeArchive]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return sortedArchive;
    }
    return sortedArchive.filter((entry) =>
      `${entry.date} ${entry.platform} ${entry.type} ${entry.title} ${entry.summary}`
        .toLowerCase()
        .includes(term),
    );
  }, [query, sortedArchive]);

  useEffect(() => {
    if (!selectedEntry) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedEntry]);

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <BackButton fallbackHref="/" label="Back" />
        <p className="eyebrow">Review of the Day Archive</p>
        <h1>Full calendar and searchable history.</h1>
        <p>
          Browse every featured daily review and recurring complaint pattern
          from our editorial desk.
        </p>
      </section>

      <section className="premium-card">
        <div className="section-head">
          <h2>Calendar Archive</h2>
          <input
            type="search"
            className="search-input"
            placeholder="Search by platform, issue, date, or signal type"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="archive-grid">
          {filtered.length ? (
            filtered.map((entry, index) => (
              <article
                key={`${entry.date}-${entry.title}-${index}`}
                className="story-card neutral"
              >
                <p className="story-platform">{entry.date}</p>
                <h3 className="archive-title-clamp">{entry.title}</h3>
                <p className="score-label">
                  {entry.platform} | {entry.type}
                </p>
                <p className="archive-summary-clamp">{entry.summary}</p>
                <button
                  type="button"
                  className="text-link archive-read-more"
                  onClick={() => setSelectedEntry(entry)}
                >
                  Read More
                </button>
              </article>
            ))
          ) : (
            <p className="archive-empty">
              No results found for this search. Try platform name or issue
              keyword.
            </p>
          )}
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">Pattern Reports</p>
        <div className="card-grid three-up">
          {safeReports.map((report) => (
            <article key={report.title} className="story-card positive">
              <h3>{report.title}</h3>
              <p>{report.insight}</p>
            </article>
          ))}
        </div>
      </section>

      {selectedEntry ? (
        <section
          className="archive-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Review details"
          onClick={() => setSelectedEntry(null)}
        >
          <article
            className="archive-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="archive-modal-head">
              <p className="story-platform">{selectedEntry.date}</p>
              <button
                type="button"
                className="ghost-button"
                aria-label="Close dialog"
                onClick={() => setSelectedEntry(null)}
              >
                <X size={18} />
              </button>
            </div>
            <h2>{selectedEntry.title}</h2>
            <p className="score-label">
              {selectedEntry.platform} | {selectedEntry.type}
            </p>
            <p>{selectedEntry.summary}</p>
          </article>
        </section>
      ) : null}
    </main>
  );
}
