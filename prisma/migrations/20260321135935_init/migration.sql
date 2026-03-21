-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('PLAY_STORE', 'REDDIT', 'X');

-- CreateEnum
CREATE TYPE "CredibilityTier" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT,
    "logoUrl" TEXT,
    "playStoreAppId" TEXT,
    "supportScore" INTEGER NOT NULL DEFAULT 50,
    "relatabilityScore" INTEGER NOT NULL DEFAULT 50,
    "helpfulnessScore" INTEGER NOT NULL DEFAULT 50,
    "compositeScore" INTEGER NOT NULL DEFAULT 50,
    "lastScoredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "source" "ReviewSource" NOT NULL,
    "externalId" TEXT,
    "author" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "url" TEXT,
    "sentimentScore" INTEGER NOT NULL DEFAULT 0,
    "credibilityTier" "CredibilityTier" NOT NULL DEFAULT 'LOW',
    "supportSignal" INTEGER NOT NULL DEFAULT 0,
    "relatabilitySignal" INTEGER NOT NULL DEFAULT 0,
    "helpfulnessSignal" INTEGER NOT NULL DEFAULT 0,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreSnapshot" (
    "id" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "supportScore" INTEGER NOT NULL,
    "relatabilityScore" INTEGER NOT NULL,
    "helpfulnessScore" INTEGER NOT NULL,
    "compositeScore" INTEGER NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "windowHours" INTEGER NOT NULL DEFAULT 168,

    CONSTRAINT "ScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_slug_key" ON "Platform"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE INDEX "Review_platformId_source_idx" ON "Review"("platformId", "source");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_source_externalId_key" ON "Review"("source", "externalId");

-- CreateIndex
CREATE INDEX "ScoreSnapshot_platformId_generatedAt_idx" ON "ScoreSnapshot"("platformId", "generatedAt");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreSnapshot" ADD CONSTRAINT "ScoreSnapshot_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
