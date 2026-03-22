import "dotenv/config";
import { runRedditIngestion } from "../lib/ingestion/reddit.js";
import { prisma } from "./shared.js";

async function run() {
  await runRedditIngestion();
}

run()
  .catch((error) => {
    console.error("Reddit RSS ingestor failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
