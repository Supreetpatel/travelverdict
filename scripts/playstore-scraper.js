import "dotenv/config";
import { runPlayStoreIngestion } from "../lib/ingestion/playstore.js";
import { prisma } from "./shared.js";

async function run() {
  await runPlayStoreIngestion();
}

run()
  .catch((error) => {
    console.error("Play Store scraper failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
