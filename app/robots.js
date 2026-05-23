export default function robots() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelverdict.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
