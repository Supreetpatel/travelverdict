import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import AppToaster from "./components/app-toaster";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo-utils";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelverdict.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StrateStats | Independent scorecards for Indian travel platforms",
    template: "%s | StrateStats",
  },
  description:
    "Clear weekly scorecards for travel platform quality and support performance. Rate Indian travel platforms based on support, reliability, and customer happiness.",
  keywords: [
    "travel platforms India",
    "platform ratings",
    "travel app reviews",
    "platform comparison",
    "travel quality scores",
    "support ratings",
    "booking platform reviews",
  ],
  authors: [{ name: "StrateStats" }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    title: "StrateStats | Independent scorecards for Indian travel platforms",
    description:
      "Clear weekly scorecards for travel platform quality and support performance.",
    url: SITE_URL,
    siteName: "StrateStats",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "StrateStats - Travel Platform Ratings",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StrateStats",
    description:
      "Clear weekly scorecards for travel platform quality and support performance.",
    image: `${SITE_URL}/twitter-image.png`,
    creator: "@stratestats",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

// Next.js expects `viewport` to be exported separately from `metadata`.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://api.example.com" />
      </head>
      <body>
        <SiteHeader />
        <AppToaster />
        {children}
        <SiteFooter />

        {/* Structured Data - JSON-LD */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
          suppressHydrationWarning
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
          suppressHydrationWarning
        />
      </body>
    </html>
  );
}
