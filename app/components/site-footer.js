import Link from "next/link";

export default function SiteFooter() {
  const supreetPortfolio = "https://www.supreetpatel.me";

  return (
    <footer className="site-shell site-footer border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Row: Brand & Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-sm mb-4">
          {/* Brand Group */}

          <Link
            href="/"
            className="footer-title font-bold tracking-tight text-lg"
          >
            StrateStats
          </Link>

          {/* Navigation Links */}
          <nav className="footer-links flex items-center space-x-6">
            <Link
              href="/review-archive"
              className="transition-opacity hover:opacity-50"
            >
              Review Archive
            </Link>
            <Link
              href="/compare"
              className="transition-opacity hover:opacity-50"
            >
              Compare Tool
            </Link>
            <a
              href="mailto:hello@stratestats.in"
              className="opacity-80 hover:opacity-100 underline underline-offset-4"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Bottom Row: Developer Credit */}
        <div className="border-t border-gray-50 flex justify-center items-center">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-30 hover:opacity-60 transition-opacity cursor-default">
            Developed by{" "}
            <a
              href={supreetPortfolio}
              target="_blank"
              rel="noreferrer noopener"
              className="font-bold text-gray-950 underline underline-offset-2 cursor-pointer"
            >
              Supreet
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
