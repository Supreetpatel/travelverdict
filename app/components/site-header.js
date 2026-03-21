"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home Page" },
  { href: "/compare", label: "Compare" },
  { href: "/review-archive", label: "Review Archive" },
  { href: "/weekly-roundup", label: "Weekly Roundup" },
  { href: "/categories", label: "Categories" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-shell">
      <div className="shell-topbar">
        <Link href="/" className="brand-mark">
          <span className="brand-name">StrateStats</span>
          <span className="brand-chip">India</span>
        </Link>
        <nav className="main-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`main-nav-link ${isActive(link.href) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
