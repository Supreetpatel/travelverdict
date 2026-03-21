import "dotenv/config";
import { runAllIngestion } from "../lib/ingestion/run-all.js";

runAllIngestion()
  .then((summary) => {
    console.log("\nAll worker jobs attempted.");
    console.log(JSON.stringify(summary, null, 2));
  })
  .catch((error) => {
    console.error("Ingestion pipeline failed", error);
    process.exit(1);
  });
