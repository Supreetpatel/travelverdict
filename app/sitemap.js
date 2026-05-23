import { getPlatformSlugs } from "@/lib/db-ui";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelverdict.vercel.app";

export default async function sitemap() {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories/support`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories/relatability`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories/helpfulness`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/review-archive`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/weekly-roundup`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic platform pages
  let platformPages = [];
  try {
    const slugs = await getPlatformSlugs();
    platformPages = slugs.map((slug) => ({
      url: `${baseUrl}/platforms/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    }));
  } catch (error) {
    console.error("Error fetching platform slugs for sitemap:", error);
  }

  return [...staticPages, ...platformPages];
}
