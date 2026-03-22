import * as cheerio from "cheerio";
import {
  prisma,
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

export async function runRedditIngestion() {
  const rssUrls = getRedditRssUrls();
  const platforms = await prisma.platform.findMany();

  for (const platform of platforms) {
    const keyword = platform.name.toLowerCase();

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

        if (!text || !text.toLowerCase().includes(keyword)) {
          continue;
        }

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
      }
    }

    await refreshPlatformScores(platform.id);
    console.log(`Reddit RSS ingest complete: ${platform.name}`);
  }

  return { source: "reddit-rss", ok: true, platforms: platforms.length };
}
