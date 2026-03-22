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
  title: {
    default: "StrateStats | Independent scorecards for Indian travel platforms",
  },
  description:
    "Clear weekly scorecards for travel platform quality and support performance.",
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
