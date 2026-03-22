import * as cheerio from "cheerio";
import {
  prisma,
  makeExternalId,
  refreshPlatformScores,
  upsertReview,
} from "../../scripts/shared.js";

function getInstagramUrls() {
  const fromEnv = process.env.INSTAGRAM_URLS?.trim();
  if (fromEnv) {
    return fromEnv
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  // Backward-compatible fallback to old env var name.
  const legacyUrls = process.env.CONSUMER_FORUM_URLS?.trim();
  if (legacyUrls) {
    return legacyUrls
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return ["https://www.instagram.com/explore/tags/travel/"];
}

function extractInstagramPosts($, baseUrl) {
  const posts = [];

  const selectors = [
    "article",
    "main a",
    "section a",
    "div[role='button']",
    "li",
  ];

  for (const selector of selectors) {
    const nodes = $(selector).toArray();
    for (const node of nodes) {
      const element = $(node);
      const text = element.text().trim();

      if (text.length < 40) {
        continue;
      }

      const href =
        element.attr("href") || element.find("a").first().attr("href") || null;
      const url = href ? new URL(href, baseUrl).toString() : baseUrl;

      posts.push({ text, url });
    }

    if (posts.length > 0) {
      break;
    }
  }

  return posts.slice(0, 120);
}

export async function runInstagramIngestion() {
  const instagramUrls = getInstagramUrls();
  const platforms = await prisma.platform.findMany();

  for (const platform of platforms) {
    const keyword = platform.name.toLowerCase();

    for (const instagramUrl of instagramUrls) {
      const response = await fetch(instagramUrl, {
        headers: {
          "User-Agent": "travelverdict-bot/1.0",
        },
      });

      if (!response.ok) {
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const posts = extractInstagramPosts($, instagramUrl);

      for (const post of posts) {
        if (!post.text.toLowerCase().includes(keyword)) {
          continue;
        }

        const externalId = makeExternalId(
          "INSTAGRAM",
          platform.id,
          post.url,
          post.text,
        );

        await upsertReview({
          platformId: platform.id,
          source: "INSTAGRAM",
          externalId,
          author: null,
          content: post.text,
          rating: null,
          url: post.url,
          createdAt: null,
          raw: {
            instagramUrl,
          },
        });
      }
    }

    await refreshPlatformScores(platform.id);
    console.log(`Instagram ingest complete: ${platform.name}`);
  }

  return { source: "instagram", ok: true, platforms: platforms.length };
}
