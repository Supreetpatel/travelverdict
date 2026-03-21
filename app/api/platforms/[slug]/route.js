import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const platform = await prisma.platform.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: {
            scrapedAt: "desc",
          },
          take: 100,
        },
        snapshots: {
          orderBy: {
            generatedAt: "desc",
          },
          take: 12,
        },
      },
    });

    if (!platform) {
      return NextResponse.json(
        { error: "Platform not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: platform.id,
      slug: platform.slug,
      name: platform.name,
      logoUrl: platform.logoUrl,
      handle: platform.handle,
      scores: {
        support: platform.supportScore,
        relatability: platform.relatabilityScore,
        helpfulness: platform.helpfulnessScore,
        composite: platform.compositeScore,
      },
      snapshots: platform.snapshots.map((snapshot) => ({
        supportScore: snapshot.supportScore,
        relatabilityScore: snapshot.relatabilityScore,
        helpfulnessScore: snapshot.helpfulnessScore,
        compositeScore: snapshot.compositeScore,
        generatedAt: snapshot.generatedAt,
      })),
      reviews: platform.reviews.map((review) => ({
        source: review.source,
        content: review.content,
        rating: review.rating,
        url: review.url,
        createdAt: review.createdAt,
        scrapedAt: review.scrapedAt,
        credibilityTier: review.credibilityTier,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch platform", detail: String(error) },
      { status: 500 },
    );
  }
}
