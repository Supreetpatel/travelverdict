import * as cheerio from "cheerio";
import {
  getAllPlatforms,
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

function normalize(value) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildKeywords(platform) {
  const variants = [platform.name, platform.slug, platform.handle]
    .filter(Boolean)
    .map((item) => normalize(item))
    .filter(Boolean);

  return Array.from(new Set(variants));
}

function includesAnyKeyword(text, keywords) {
  const haystack = normalize(text);
  return keywords.some((keyword) => haystack.includes(keyword));
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
  const platforms = await getAllPlatforms();

  for (const platform of platforms) {
    const keywords = buildKeywords(platform);
    let matched = 0;
    let inserted = 0;
    let extractedPosts = 0;

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
      extractedPosts += posts.length;

      for (const post of posts) {
        if (!includesAnyKeyword(post.text, keywords)) {
          continue;
        }

        matched += 1;

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

        inserted += 1;
      }
    }

    await refreshPlatformScores(platform.id);
    console.log(
      `Instagram ingest complete: ${platform.name} | extracted=${extractedPosts} | matched=${matched} | upserted=${inserted}`,
    );
  }

  return { source: "instagram", ok: true, platforms: platforms.length };
}
