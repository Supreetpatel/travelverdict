import { NextResponse } from "next/server";
import { rankedBy } from "@/app/data";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const categoryColumn = {
  composite: "compositeScore",
  support: "supportScore",
  relatability: "relatabilityScore",
  helpfulness: "helpfulnessScore",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "composite";
  const column = categoryColumn[category] ?? categoryColumn.composite;

  try {
    const platforms = await prisma.platform.findMany({
      orderBy: {
        [column]: "desc",
      },
      take: 5,
      select: {
        slug: true,
        name: true,
        logoUrl: true,
        supportScore: true,
        relatabilityScore: true,
        helpfulnessScore: true,
        compositeScore: true,
      },
    });

    const data = platforms.map((platform, index) => ({
      rank: index + 1,
      id: platform.slug,
      name: platform.name,
      logoUrl: platform.logoUrl,
      score:
        category === "support"
          ? platform.supportScore
          : category === "relatability"
            ? platform.relatabilityScore
            : category === "helpfulness"
              ? platform.helpfulnessScore
              : platform.compositeScore,
      support: `${platform.supportScore} score`,
      coverage: "Live from PostgreSQL",
    }));

    return NextResponse.json({ source: "database", category, data });
  } catch {
    const fallback = rankedBy(category);
    return NextResponse.json({ source: "fallback", category, data: fallback });
  }
}
