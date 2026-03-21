import Link from "next/link";

export const metadata = {
  description:
    "Explore Support, Relatability, and Helpfulness deep-dive pages.",
};

const categoryCards = [
  {
    href: "/categories/support",
    title: "Support",
    detail:
      "Monthly support tests, first-response speed, and escalation quality leaderboards.",
  },
  {
    href: "/categories/relatability",
    title: "Relatability",
    detail:
      "Built for Bharat rankings focused on language support and local travel context.",
  },
  {
    href: "/categories/helpfulness",
    title: "Helpfulness",
    detail:
      "Booking friction audits, pricing clarity, and mobile experience performance.",
  },
];

export default function CategoriesIndexPage() {
  return (
    <main className="site-shell page-block">
      <section className="page-intro">
        <p className="eyebrow">Category Deep-Dives</p>
        <h1>Choose what you want to evaluate.</h1>
        <p>
          Open a focused view for Support, Relatability, or Helpfulness to
          understand why platform scores move.
        </p>
      </section>

      <section className="card-grid three-up">
        {categoryCards.map((item) => (
          <article key={item.href} className="premium-card metric-card">
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
            <Link href={item.href} className="text-link">
              Open {item.title}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
