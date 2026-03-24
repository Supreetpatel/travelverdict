import CompareTool from "../components/compare-tool";
import BackButton from "../components/back-button";
import { getComparePlatforms } from "@/lib/db-ui";
import { Scale, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  description: "Head-to-head travel platform comparison by use case.",
};

export default async function ComparePage() {
  const platforms = await getComparePlatforms();

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <BackButton fallbackHref="/" label="Back" />
        <p className="eyebrow">Head-to-Head</p>
        <h1>Compare two platforms before you book.</h1>
        <p>
          Switch use cases and instantly see who wins on Happiness, Support, and
          Reliability.
        </p>
      </section>

      <section className="premium-card category-hero-card">
        <div className="category-hero-head">
          <p className="eyebrow">Comparison Engine</p>
          <span className="category-hero-chip">
            <Sparkles size={14} /> Live weighted scoring
          </span>
        </div>
        <h2>
          <Scale size={18} style={{ verticalAlign: "text-bottom" }} /> Compare
          with confidence, not guesswork
        </h2>
        <p>
          Benchmark two platforms side by side across category signals to pick
          the better fit for your travel use case.
        </p>
      </section>

      <CompareTool platforms={platforms} />
    </main>
  );
}
