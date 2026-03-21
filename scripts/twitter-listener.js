import "dotenv/config";
import { runTwitterIngestion } from "../lib/ingestion/twitter.js";
import { prisma } from "./shared.js";

async function run() {
  await runTwitterIngestion();
}

run()
  .catch((error) => {
    console.error("X listener failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
