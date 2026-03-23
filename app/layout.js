import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import AppToaster from "./components/app-toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelverdict.vercel.app",
  ),
  title: {
    default: "StrateStats | Independent scorecards for Indian travel platforms",
  },
  description:
    "Clear weekly scorecards for travel platform quality and support performance.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StrateStats | Independent scorecards for Indian travel platforms",
    description:
      "Clear weekly scorecards for travel platform quality and support performance.",
    siteName: "StrateStats",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StrateStats",
    description:
      "Clear weekly scorecards for travel platform quality and support performance.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <SiteHeader />
        <AppToaster />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
