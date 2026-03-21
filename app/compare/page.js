import CompareTool from "../components/compare-tool";
import { getComparePlatforms } from "@/lib/db-ui";

export const metadata = {
  description: "Head-to-head travel platform comparison by use case.",
};

export default async function ComparePage() {
  const platforms = await getComparePlatforms();

  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Head-to-Head</p>
        <h1>Compare two platforms before you book.</h1>
        <p>
          Switch use cases and instantly see who wins on Helpfulness, Support,
          and Relatability.
        </p>
      </section>
      <CompareTool platforms={platforms} />
    </main>
  );
}
