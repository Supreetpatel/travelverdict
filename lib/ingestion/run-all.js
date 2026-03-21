import { prisma } from "../../scripts/shared.js";
import { runPlayStoreIngestion } from "./playstore.js";
import { runTwitterIngestion } from "./twitter.js";
import { runRedditIngestion } from "./reddit.js";

export async function runAllIngestion({ disconnect = true } = {}) {
  const results = [];

  const hasTwitter = Boolean(process.env.TWITTER_BEARER_TOKEN);
  const hasReddit = Boolean(
    process.env.REDDIT_USER_AGENT &&
    process.env.REDDIT_CLIENT_ID &&
    process.env.REDDIT_CLIENT_SECRET &&
    process.env.REDDIT_REFRESH_TOKEN,
  );

  const tasks = [
    { name: "playstore", fn: runPlayStoreIngestion },
    { name: "x", fn: runTwitterIngestion, enabled: hasTwitter },
    { name: "reddit", fn: runRedditIngestion, enabled: hasReddit },
  ];

  for (const task of tasks) {
    if (task.enabled === false) {
      results.push({
        source: task.name,
        ok: false,
        skipped: true,
        reason: "Credentials not configured",
      });
      continue;
    }

    try {
      const outcome = await task.fn();
      results.push(outcome);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`${task.name} ingestion failed: ${message}`);
      results.push({ source: task.name, ok: false, error: message });
    }
  }

  if (disconnect) {
    await prisma.$disconnect();
  }

  return {
    ok: results.some((item) => item.ok),
    results,
  };
}
