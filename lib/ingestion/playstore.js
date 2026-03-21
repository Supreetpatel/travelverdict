import gplay from "google-play-scraper";
import {
  prisma,
  makeExternalId,
  refreshPlatformScores,
  resolveReviewLimit,
  upsertReview,
} from "../../scripts/shared.js";

export async function runPlayStoreIngestion() {
  const limit = resolveReviewLimit();
  const platforms = await prisma.platform.findMany({
    where: {
      playStoreAppId: {
        not: null,
      },
    },
  });

  for (const platform of platforms) {
    if (!platform.playStoreAppId) {
      continue;
    }

    const reviews = await gplay.reviews({
      appId: platform.playStoreAppId,
      sort: gplay.sort.NEWEST,
      num: limit,
      lang: "en",
      country: "in",
    });

    for (const review of reviews.data ?? []) {
      const content = review.text?.trim();
      if (!content) {
        continue;
      }

      const externalId = makeExternalId(
        "PLAY_STORE",
        platform.id,
        review.id,
        content,
      );

      await upsertReview({
        platformId: platform.id,
        source: "PLAY_STORE",
        externalId,
        author: review.userName,
        content,
        rating: review.score ?? null,
        url: review.url ?? null,
        createdAt: review.date ? new Date(review.date) : null,
        raw: review,
      });
    }

    await refreshPlatformScores(platform.id);
    console.log(`Play Store sync complete: ${platform.name}`);
  }

  return { source: "playstore", ok: true, platforms: platforms.length };
}
