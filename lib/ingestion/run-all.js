import { prisma } from "../../scripts/shared.js";
import { runPlayStoreIngestion } from "./playstore.js";
import { runRedditIngestion } from "./reddit.js";
import { runInstagramIngestion } from "./instagram.js";

export async function runAllIngestion({ disconnect = true } = {}) {
  const results = [];

  const tasks = [
    { name: "playstore", fn: runPlayStoreIngestion },
    { name: "reddit-rss", fn: runRedditIngestion },
    { name: "instagram", fn: runInstagramIngestion },
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
