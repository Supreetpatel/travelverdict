import { neon } from "@neondatabase/serverless";

function isLocalDatabaseUrl(url) {
  if (!url) {
    return false;
  }

  return /localhost|127\.0\.0\.1/i.test(url);
}

export function resolveDatabaseUrl() {
  const candidates = [
    process.env.NEON_DATABASE_URL,
    process.env.NEON_POOLER_URL,
    process.env.NEON_DIRECT_URL,
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
  ].filter(Boolean);

  if (!candidates.length) {
    return null;
  }

  if (process.env.VERCEL) {
    const nonLocal = candidates.find((value) => !isLocalDatabaseUrl(value));
    if (nonLocal) {
      return nonLocal;
    }
  }

  return candidates[0] ?? null;
}

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  throw new Error(
    "Database URL is required. Set DATABASE_URL or NEON_DATABASE_URL.",
  );
}

export const db = neon(databaseUrl);
