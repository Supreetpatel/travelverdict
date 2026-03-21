import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-shell site-footer">
      <div>
        <p className="footer-title">StrateStats</p>
        <p className="footer-copy">
          Independent scorecards for Indian travel platforms, updated weekly.
        </p>
      </div>
      <div className="footer-links">
        <Link href="/review-archive">Review Archive</Link>
        <Link href="/compare">Compare Tool</Link>
        <Link href="/weekly-roundup">Weekly Roundup</Link>
        <a href="mailto:hello@stratestats.in">hello@stratestats.in</a>
      </div>
    </footer>
  );
}
