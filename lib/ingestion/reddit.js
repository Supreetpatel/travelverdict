import * as cheerio from "cheerio";
import {
  getAllPlatforms,
  makeExternalId,
  refreshPlatformScores,
  upsertReview,
} from "../../scripts/shared.js";

function getRedditRssUrls() {
  const fromEnv = process.env.REDDIT_RSS_URLS?.trim();
  if (fromEnv) {
    return fromEnv
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [
    "https://www.reddit.com/r/india/new/.rss",
    "https://www.reddit.com/r/IndianTravel/new/.rss",
  ];
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

export async function runRedditIngestion() {
  const rssUrls = getRedditRssUrls();
  const platforms = await getAllPlatforms();

  for (const platform of platforms) {
    const keywords = buildKeywords(platform);
    let matched = 0;
    let inserted = 0;

    for (const rssUrl of rssUrls) {
      const response = await fetch(rssUrl, {
        headers: {
          "User-Agent": "stratestats-bot/1.0",
        },
      });
      if (!response.ok) {
        continue;
      }

      const xml = await response.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      const entries = $("entry").toArray();

      for (const node of entries) {
        const title = $(node).find("title").first().text().trim();
        const content = $(node).find("content").first().text().trim();
        const text = `${title}\n\n${content}`.trim();

        if (!text || !includesAnyKeyword(text, keywords)) {
          continue;
        }

        matched += 1;

        const permalink =
          $(node).find("link[rel='alternate']").attr("href") ||
          $(node).find("id").first().text().trim() ||
          null;
        const published = $(node).find("published").first().text().trim();
        const author = $(node).find("author > name").first().text().trim();

        const externalId = makeExternalId(
          "REDDIT",
          platform.id,
          permalink,
          text,
        );

        await upsertReview({
          platformId: platform.id,
          source: "REDDIT",
          externalId,
          author: author || null,
          content: text,
          rating: null,
          url: permalink,
          createdAt: published ? new Date(published) : null,
          raw: {
            title,
            rssUrl,
            permalink,
          },
        });

        inserted += 1;
      }
    }

    await refreshPlatformScores(platform.id);
    console.log(
      `Reddit RSS ingest complete: ${platform.name} | matched=${matched} | upserted=${inserted}`,
    );
  }

  return { source: "reddit-rss", ok: true, platforms: platforms.length };
}
