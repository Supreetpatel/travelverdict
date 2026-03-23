"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/", label: "Home Page" },
  { href: "/compare", label: "Compare" },
  { href: "/review-archive", label: "Review Archive" },
  { href: "/categories", label: "Categories" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-shell site-header">
      <div className="shell-topbar">
        <Link href="/" className="brand-mark">
          <span className="brand-logo-sheen" aria-hidden="true">
            <Logo className="brand-logo brand-logo-desktop" />
            <Logo className="brand-logo brand-logo-compact" variant="compact" />
          </span>
          <span className="brand-name">StrateStats</span>
          <span className="brand-chip">India</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-controls="primary-nav"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span>{isMenuOpen ? "Close" : "Menu"}</span>
        </button>

        <nav
          id="primary-nav"
          className={`main-nav ${isMenuOpen ? "open" : ""}`}
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`main-nav-link ${isActive(link.href) ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {isMenuOpen ? (
          <button
            type="button"
            className="nav-overlay"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
          />
        ) : null}
      </div>
    </header>
  );
}
