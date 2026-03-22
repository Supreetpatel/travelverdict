import "dotenv/config";
import crypto from "node:crypto";
import { db } from "../lib/neon-db.js";

const platforms = [
  {
    name: "Airbnb",
    slug: "airbnb",
    handle: "@airbnb",
    playStoreAppId: "com.airbnb.android",
  },
  {
    name: "Booking.com",
    slug: "booking-com",
    handle: "@bookingcom",
    playStoreAppId: "com.booking",
  },
  {
    name: "OYO Rooms",
    slug: "oyo-rooms",
    handle: "@oyorooms",
    playStoreAppId: "com.oyo.app",
  },
  {
    name: "MakeMyTrip",
    slug: "makemytrip",
    handle: "@makemytrip",
    playStoreAppId: "com.makemytrip",
  },
  {
    name: "Agoda",
    slug: "agoda",
    handle: "@agodaofficial",
    playStoreAppId: "com.agoda.mobile.android",
  },
  {
    name: "Hotels.com",
    slug: "hotels-com",
    handle: "@hotelscom",
    playStoreAppId: "com.hotels.android",
  },
  {
    name: "Expedia",
    slug: "expedia",
    handle: "@expedia",
    playStoreAppId: "com.expedia.bookings",
  },
  {
    name: "TripAdvisor",
    slug: "tripadvisor",
    handle: "@tripadvisor",
    playStoreAppId: "com.tripadvisor.tripadvisor",
  },
  {
    name: "Goibibo",
    slug: "goibibo",
    handle: "@goibibo",
    playStoreAppId: "com.goibibo",
  },
  {
    name: "Yatra",
    slug: "yatra",
    handle: "@yatraofficial",
    playStoreAppId: "com.yatra.base",
  },
  {
    name: "Cleartrip",
    slug: "cleartrip",
    handle: "@cleartrip",
    playStoreAppId: "com.cleartrip.android",
  },
  {
    name: "Goa Villas",
    slug: "goa-villas",
    handle: "@goavillas",
    playStoreAppId: null,
  },
  {
    name: "FabHotels",
    slug: "fabhotels",
    handle: "@fabhotels",
    playStoreAppId: "com.fabhotels.guests",
  },
  {
    name: "Treebo",
    slug: "treebo",
    handle: "@treebohotels",
    playStoreAppId: "com.treebo.hotels",
  },
  {
    name: "Trivago",
    slug: "trivago",
    handle: "@trivago",
    playStoreAppId: "com.trivago",
  },
  {
    name: "Ixigo Hotels",
    slug: "ixigo-hotels",
    handle: "@ixigo",
    playStoreAppId: "com.ixigo",
  },
  {
    name: "EaseMyTrip",
    slug: "easemytrip",
    handle: "@easemytrip",
    playStoreAppId: "com.easemytrip.android",
  },
  {
    name: "Hostelworld",
    slug: "hostelworld",
    handle: "@hostelworld",
    playStoreAppId: "com.hostelworld.app",
  },
  {
    name: "Marriott Bonvoy",
    slug: "marriott-bonvoy",
    handle: "@marriottbonvoy",
    playStoreAppId: "com.marriott.mrt",
  },
  {
    name: "Hilton Honors",
    slug: "hilton-honors",
    handle: "@hiltonhotels",
    playStoreAppId: "com.hilton.android.hhonors",
  },
  {
    name: "IHG Hotels & Rewards",
    slug: "ihg-hotels",
    handle: "@ihghotels",
    playStoreAppId: "com.ihg.apps.android",
  },
  {
    name: "Accor ALL",
    slug: "accor-all",
    handle: "@accor",
    playStoreAppId: "com.accor.appli.hybrid",
  },
  {
    name: "KAYAK",
    slug: "kayak",
    handle: "@kayak",
    playStoreAppId: "com.kayak.android",
  },
  {
    name: "Hopper",
    slug: "hopper",
    handle: "@hopper",
    playStoreAppId: "com.hopper.mountainview.play",
  },
];

async function seed() {
  console.log("Starting platform seed...");

  for (const platform of platforms) {
    try {
      const id = crypto.randomUUID();

      await db`
        INSERT INTO "Platform" (
          "id",
          "slug",
          "name",
          "handle",
          "playStoreAppId",
          "supportScore",
          "relatabilityScore",
          "helpfulnessScore",
          "compositeScore",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${id},
          ${platform.slug},
          ${platform.name},
          ${platform.handle ?? null},
          ${platform.playStoreAppId ?? null},
          50,
          50,
          50,
          50,
          NOW(),
          NOW()
        )
        ON CONFLICT ("slug")
        DO UPDATE SET
          "name" = EXCLUDED."name",
          "handle" = EXCLUDED."handle",
          "playStoreAppId" = EXCLUDED."playStoreAppId",
          "updatedAt" = NOW()
      `;

      console.log(`✓ Seeded: ${platform.name}`);
    } catch (error) {
      console.error(`✗ Failed to seed ${platform.name}:`, error.message);
    }
  }

  console.log("Seed complete!");

  // Verify
  const count = await db`SELECT COUNT(*)::int AS count FROM "Platform"`;
  console.log(`\nTotal platforms in database: ${count[0].count}`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
