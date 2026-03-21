import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for seeding.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const platforms = [
  {
    slug: "makemytrip",
    name: "MakeMyTrip",
    handle: "@makemytrip",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/makemytrip.png",
    playStoreAppId: "com.makemytrip",
  },
  {
    slug: "oyo",
    name: "OYO",
    handle: "@oyorooms",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/oyo.png",
    playStoreAppId: "com.oyo.consumer",
  },
  {
    slug: "airbnb-india",
    name: "Airbnb India",
    handle: "@airbnb",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/airbnb.png",
    playStoreAppId: "com.airbnb.android",
  },
  {
    slug: "aorta-rooms",
    name: "Aorta Rooms",
    handle: "@aortarooms",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/aorta.png",
    playStoreAppId: null,
  },
  {
    slug: "cleartrip",
    name: "Cleartrip",
    handle: "@cleartrip",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/cleartrip.png",
    playStoreAppId: "com.cleartrip.android",
  },
  {
    slug: "yatra",
    name: "Yatra",
    handle: "@yatraofficial",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/yatra.png",
    playStoreAppId: "com.yatra.base",
  },
  {
    slug: "goibibo",
    name: "Goibibo",
    handle: "@goibibo",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/goibibo.png",
    playStoreAppId: "com.goibibo",
  },
  {
    slug: "ixigo",
    name: "ixigo",
    handle: "@ixigo",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/ixigo.png",
    playStoreAppId: "com.ixigo.train.ixitrain",
  },
  {
    slug: "easemytrip",
    name: "EaseMyTrip",
    handle: "@easemytrip",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/easemytrip.png",
    playStoreAppId: "com.easemytrip.android",
  },
  {
    slug: "booking-com",
    name: "Booking.com",
    handle: "@bookingcom",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/booking-com.png",
    playStoreAppId: "com.booking",
  },
  {
    slug: "agoda",
    name: "Agoda",
    handle: "@agoda",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/agoda.png",
    playStoreAppId: "com.agoda.mobile.consumer",
  },
  {
    slug: "tripadvisor",
    name: "Tripadvisor",
    handle: "@tripadvisor",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/tripadvisor.png",
    playStoreAppId: "com.tripadvisor.tripadvisor",
  },
  {
    slug: "trivago",
    name: "trivago",
    handle: "@trivago",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/trivago.png",
    playStoreAppId: "com.trivago",
  },
  {
    slug: "expedia",
    name: "Expedia",
    handle: "@expedia",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/expedia.png",
    playStoreAppId: "com.expedia.bookings",
  },
  {
    slug: "skyscanner",
    name: "Skyscanner",
    handle: "@skyscanner",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/skyscanner.png",
    playStoreAppId: "net.skyscanner.android.main",
  },
  {
    slug: "hopper",
    name: "Hopper",
    handle: "@hopper",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/hopper.png",
    playStoreAppId: "com.hopper.mountainview.play",
  },
  {
    slug: "kayak",
    name: "KAYAK",
    handle: "@kayak",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/kayak.png",
    playStoreAppId: "com.kayak.android",
  },
  {
    slug: "hostelworld",
    name: "Hostelworld",
    handle: "@hostelworld",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/hostelworld.png",
    playStoreAppId: "com.hostelworld.app",
  },
  {
    slug: "treebo",
    name: "Treebo",
    handle: "@treebohotels",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/treebo.png",
    playStoreAppId: "com.treebo.hotels",
  },
  {
    slug: "fabhotels",
    name: "FabHotels",
    handle: "@fabhotels",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/fabhotels.png",
    playStoreAppId: "com.fabhotels.guests",
  },
  {
    slug: "hotels-com",
    name: "Hotels.com",
    handle: "@hotelsdotcom",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/hotels-com.png",
    playStoreAppId: "com.hcom.android",
  },
  {
    slug: "marriott-bonvoy",
    name: "Marriott Bonvoy",
    handle: "@marriottbonvoy",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/marriott-bonvoy.png",
    playStoreAppId: "com.marriott.mrt",
  },
  {
    slug: "hilton-honors",
    name: "Hilton Honors",
    handle: "@hiltonhotels",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/hilton-honors.png",
    playStoreAppId: "com.hilton.android.hhonors",
  },
  {
    slug: "ihg-hotels",
    name: "IHG Hotels & Rewards",
    handle: "@ihghotels",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/ihg.png",
    playStoreAppId: "com.ihg.apps.android",
  },
  {
    slug: "accor-all",
    name: "Accor ALL",
    handle: "@accor",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/accor-all.png",
    playStoreAppId: "com.accor.appli.hybrid",
  },
  {
    slug: "airindia",
    name: "Air India",
    handle: "@airindia",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/airindia.png",
    playStoreAppId: "com.tcs.mobility.airindia",
  },
  {
    slug: "indigo",
    name: "IndiGo",
    handle: "@indigo6e",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/indigo.png",
    playStoreAppId: "com.goindigo.in",
  },
  {
    slug: "irctc-rail-connect",
    name: "IRCTC Rail Connect",
    handle: "@irctcofficial",
    logoUrl:
      "https://res.cloudinary.com/demo/image/upload/v1700000001/stratestats/irctc.png",
    playStoreAppId: "cris.org.in.prs.ima",
  },
];

async function main() {
  for (const platform of platforms) {
    await prisma.platform.upsert({
      where: { slug: platform.slug },
      update: {
        name: platform.name,
        handle: platform.handle,
        logoUrl: platform.logoUrl,
        playStoreAppId: platform.playStoreAppId,
      },
      create: {
        ...platform,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
