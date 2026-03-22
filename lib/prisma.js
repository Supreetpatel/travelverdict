import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;
const { Pool } = pg;

function isLocalDatabaseUrl(url) {
  if (!url) {
    return false;
  }

  return /localhost|127\.0\.0\.1/i.test(url);
}

function resolveDatabaseUrl() {
  const candidates = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL,
  ].filter(Boolean);

  if (!candidates.length) {
    return null;
  }

  if (process.env.VERCEL) {
    const nonLocal = candidates.find((value) => !isLocalDatabaseUrl(value));
    return nonLocal ?? candidates[0];
  }

  return process.env.DATABASE_URL ?? candidates[0];
}

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const shouldUseSsl = !isLocalDatabaseUrl(databaseUrl);

const pool =
  globalForPrisma.pgPool ||
  new Pool({
    connectionString: databaseUrl,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  });

if (!globalForPrisma.pgPool) {
  globalForPrisma.pgPool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
