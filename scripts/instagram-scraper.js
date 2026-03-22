import "dotenv/config";
import { runInstagramIngestion } from "../lib/ingestion/instagram.js";
import { prisma } from "./shared.js";

async function run() {
  await runInstagramIngestion();
}

run()
  .catch((error) => {
    console.error("Instagram scraper failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
