import { TwitterApi } from "twitter-api-v2";
import {
  prisma,
  makeExternalId,
  refreshPlatformScores,
  upsertReview,
} from "../../scripts/shared.js";

function ensureTwitterClient() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    throw new Error("TWITTER_BEARER_TOKEN is required");
  }
  return new TwitterApi(bearerToken);
}

export async function runTwitterIngestion() {
  const client = ensureTwitterClient();
  const api = client.readOnly;

  const platforms = await prisma.platform.findMany({
    where: {
      handle: {
        not: null,
      },
    },
  });

  for (const platform of platforms) {
    const handle = platform.handle?.replace("@", "") ?? platform.name;
    const query = `(${handle} OR \"${platform.name}\") (refund OR support OR customer care OR booking)`;

    const feed = await api.v2.search(query, {
      max_results: 50,
      "tweet.fields": ["created_at", "author_id", "lang"],
      expansions: ["author_id"],
      "user.fields": ["username", "name"],
    });

    for await (const tweet of feed) {
      if (!tweet.text?.trim()) {
        continue;
      }

      const externalId = makeExternalId("X", platform.id, tweet.id, tweet.text);
      await upsertReview({
        platformId: platform.id,
        source: "X",
        externalId,
        author: tweet.author_id ?? null,
        content: tweet.text,
        rating: null,
        url: `https://x.com/i/web/status/${tweet.id}`,
        createdAt: tweet.created_at ? new Date(tweet.created_at) : null,
        raw: tweet,
      });
    }

    await refreshPlatformScores(platform.id);
    console.log(`X listener sync complete: ${platform.name}`);
  }

  return { source: "x", ok: true, platforms: platforms.length };
}
