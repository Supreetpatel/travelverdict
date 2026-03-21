import snoowrap from "snoowrap";
import {
  prisma,
  makeExternalId,
  refreshPlatformScores,
  upsertReview,
} from "../../scripts/shared.js";

function ensureRedditClient() {
  const userAgent = process.env.REDDIT_USER_AGENT;
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const refreshToken = process.env.REDDIT_REFRESH_TOKEN;

  if (!userAgent || !clientId || !clientSecret || !refreshToken) {
    throw new Error("Reddit credentials are required in .env");
  }

  return new snoowrap({
    userAgent,
    clientId,
    clientSecret,
    refreshToken,
  });
}

export async function runRedditIngestion() {
  const reddit = ensureRedditClient();
  const subreddits = ["India", "IndianTravel"];
  const platforms = await prisma.platform.findMany();

  for (const platform of platforms) {
    const keyword = platform.name.toLowerCase();

    for (const subredditName of subreddits) {
      const posts = await reddit.getSubreddit(subredditName).search({
        query: `${keyword} refund OR support OR booking`,
        sort: "new",
        time: "week",
        limit: 40,
      });

      for (const post of posts) {
        const text = `${post.title ?? ""}\n\n${post.selftext ?? ""}`.trim();
        if (!text) {
          continue;
        }

        const externalId = makeExternalId("REDDIT", platform.id, post.id, text);

        await upsertReview({
          platformId: platform.id,
          source: "REDDIT",
          externalId,
          author: post.author?.name ?? null,
          content: text,
          rating: null,
          url: `https://reddit.com${post.permalink}`,
          createdAt: post.created_utc
            ? new Date(post.created_utc * 1000)
            : null,
          raw: {
            id: post.id,
            title: post.title,
            subreddit: subredditName,
            score: post.score,
            numComments: post.num_comments,
          },
        });
      }
    }

    await refreshPlatformScores(platform.id);
    console.log(`Reddit ingest complete: ${platform.name}`);
  }

  return { source: "reddit", ok: true, platforms: platforms.length };
}
