export const platforms = [
  {
    id: "aorta-rooms",
    name: "Aorta Rooms",
    scores: { composite: 86, helpfulness: 84, support: 89, relatability: 85 },
    responseTime: "4m",
    cityCoverage: "Tier 2 and Tier 3 Strong",
    subParameters: {
      helpfulness: [
        { label: "Booking clarity", score: 83 },
        { label: "Price transparency", score: 82 },
        { label: "Mobile experience", score: 87 },
      ],
      support: [
        { label: "First response", score: 91 },
        { label: "Ownership", score: 88 },
        { label: "Resolution speed", score: 87 },
      ],
      relatability: [
        { label: "Regional language support", score: 86 },
        { label: "Tier 2 relevance", score: 84 },
        { label: "Contextual nudges", score: 85 },
      ],
    },
    history: [72, 73, 74, 76, 78, 80, 81, 82, 83, 84, 85, 86],
    verifiedReviews: [
      {
        source: "Reddit",
        tone: "positive",
        date: "2026-03-20",
        summary: "Issue was escalated and solved in one callback.",
      },
      {
        source: "X",
        tone: "neutral",
        date: "2026-03-17",
        summary: "Great support but refund settlement took 2 days.",
      },
      {
        source: "App Store",
        tone: "positive",
        date: "2026-03-12",
        summary: "Clean checkout and no hidden fees in final invoice.",
      },
    ],
    bharatCoverage: [
      { city: "Indore", tier: "Tier 2", coverage: 92 },
      { city: "Varanasi", tier: "Tier 2", coverage: 87 },
      { city: "Mysuru", tier: "Tier 2", coverage: 90 },
      { city: "Gorakhpur", tier: "Tier 3", coverage: 79 },
      { city: "Jabalpur", tier: "Tier 3", coverage: 76 },
      { city: "Siliguri", tier: "Tier 3", coverage: 74 },
    ],
  },
  {
    id: "makemytrip",
    name: "MakeMyTrip",
    scores: { composite: 82, helpfulness: 83, support: 77, relatability: 81 },
    responseTime: "9m",
    cityCoverage: "Tier 2 Strong",
    subParameters: {
      helpfulness: [
        { label: "Booking clarity", score: 84 },
        { label: "Price transparency", score: 81 },
        { label: "Mobile experience", score: 85 },
      ],
      support: [
        { label: "First response", score: 79 },
        { label: "Ownership", score: 75 },
        { label: "Resolution speed", score: 77 },
      ],
      relatability: [
        { label: "Regional language support", score: 80 },
        { label: "Tier 2 relevance", score: 82 },
        { label: "Contextual nudges", score: 81 },
      ],
    },
    history: [74, 74, 75, 76, 78, 79, 80, 80, 81, 81, 82, 82],
    verifiedReviews: [
      {
        source: "Reddit",
        tone: "positive",
        date: "2026-03-19",
        summary: "Transparent fare lock and no checkout mismatch.",
      },
      {
        source: "X",
        tone: "negative",
        date: "2026-03-15",
        summary: "Needed two follow-ups for cancellation refund.",
      },
      {
        source: "App Store",
        tone: "positive",
        date: "2026-03-10",
        summary: "Family trip booking and vouchers were smooth.",
      },
    ],
    bharatCoverage: [
      { city: "Nagpur", tier: "Tier 2", coverage: 88 },
      { city: "Surat", tier: "Tier 2", coverage: 84 },
      { city: "Bhubaneswar", tier: "Tier 2", coverage: 85 },
      { city: "Kota", tier: "Tier 3", coverage: 72 },
      { city: "Ujjain", tier: "Tier 3", coverage: 69 },
      { city: "Ajmer", tier: "Tier 3", coverage: 71 },
    ],
  },
  {
    id: "cleartrip",
    name: "Cleartrip",
    scores: { composite: 79, helpfulness: 80, support: 74, relatability: 78 },
    responseTime: "11m",
    cityCoverage: "Tier 2 Expanding",
    subParameters: {
      helpfulness: [
        { label: "Booking clarity", score: 81 },
        { label: "Price transparency", score: 79 },
        { label: "Mobile experience", score: 80 },
      ],
      support: [
        { label: "First response", score: 75 },
        { label: "Ownership", score: 73 },
        { label: "Resolution speed", score: 74 },
      ],
      relatability: [
        { label: "Regional language support", score: 77 },
        { label: "Tier 2 relevance", score: 79 },
        { label: "Contextual nudges", score: 78 },
      ],
    },
    history: [70, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 79],
    verifiedReviews: [
      {
        source: "X",
        tone: "positive",
        date: "2026-03-20",
        summary: "Same-day support solved missed payment confirmation.",
      },
      {
        source: "Reddit",
        tone: "neutral",
        date: "2026-03-18",
        summary: "Reschedule worked, but app was confusing for add-ons.",
      },
      {
        source: "App Store",
        tone: "positive",
        date: "2026-03-07",
        summary: "Quick flight booking and accurate fare summary.",
      },
    ],
    bharatCoverage: [
      { city: "Vadodara", tier: "Tier 2", coverage: 81 },
      { city: "Coimbatore", tier: "Tier 2", coverage: 82 },
      { city: "Mangaluru", tier: "Tier 2", coverage: 78 },
      { city: "Jhansi", tier: "Tier 3", coverage: 66 },
      { city: "Belagavi", tier: "Tier 3", coverage: 64 },
      { city: "Nanded", tier: "Tier 3", coverage: 62 },
    ],
  },
  {
    id: "yatra",
    name: "Yatra",
    scores: { composite: 76, helpfulness: 78, support: 70, relatability: 77 },
    responseTime: "15m",
    cityCoverage: "Tier 2 Stable",
    subParameters: {
      helpfulness: [
        { label: "Booking clarity", score: 79 },
        { label: "Price transparency", score: 76 },
        { label: "Mobile experience", score: 78 },
      ],
      support: [
        { label: "First response", score: 71 },
        { label: "Ownership", score: 69 },
        { label: "Resolution speed", score: 70 },
      ],
      relatability: [
        { label: "Regional language support", score: 78 },
        { label: "Tier 2 relevance", score: 76 },
        { label: "Contextual nudges", score: 77 },
      ],
    },
    history: [68, 68, 69, 70, 71, 72, 73, 73, 74, 75, 75, 76],
    verifiedReviews: [
      {
        source: "Reddit",
        tone: "negative",
        date: "2026-03-19",
        summary: "Refund took 6 days and required manual escalation.",
      },
      {
        source: "X",
        tone: "positive",
        date: "2026-03-14",
        summary: "Support agent helped with itinerary correction quickly.",
      },
      {
        source: "App Store",
        tone: "neutral",
        date: "2026-03-06",
        summary: "Good deals, app can be slow during payment.",
      },
    ],
    bharatCoverage: [
      { city: "Ranchi", tier: "Tier 2", coverage: 77 },
      { city: "Gwalior", tier: "Tier 2", coverage: 76 },
      { city: "Madurai", tier: "Tier 2", coverage: 79 },
      { city: "Dhanbad", tier: "Tier 3", coverage: 61 },
      { city: "Ambala", tier: "Tier 3", coverage: 59 },
      { city: "Kolhapur", tier: "Tier 3", coverage: 63 },
    ],
  },
  {
    id: "oyo",
    name: "OYO",
    scores: { composite: 61, helpfulness: 63, support: 54, relatability: 66 },
    responseTime: "29m",
    cityCoverage: "Tier 3 Reach, Quality Volatile",
    subParameters: {
      helpfulness: [
        { label: "Booking clarity", score: 62 },
        { label: "Price transparency", score: 58 },
        { label: "Mobile experience", score: 68 },
      ],
      support: [
        { label: "First response", score: 52 },
        { label: "Ownership", score: 55 },
        { label: "Resolution speed", score: 54 },
      ],
      relatability: [
        { label: "Regional language support", score: 67 },
        { label: "Tier 2 relevance", score: 65 },
        { label: "Contextual nudges", score: 66 },
      ],
    },
    history: [73, 72, 71, 70, 69, 68, 67, 66, 64, 63, 62, 61],
    verifiedReviews: [
      {
        source: "X",
        tone: "negative",
        date: "2026-03-20",
        summary: "Last-minute cancellation at check-in with bot loop.",
      },
      {
        source: "Reddit",
        tone: "negative",
        date: "2026-03-16",
        summary: "Hotel denied booking despite confirmed voucher.",
      },
      {
        source: "App Store",
        tone: "neutral",
        date: "2026-03-09",
        summary: "Good discounts but poor support confidence.",
      },
    ],
    bharatCoverage: [
      { city: "Patna", tier: "Tier 2", coverage: 74 },
      { city: "Ludhiana", tier: "Tier 2", coverage: 72 },
      { city: "Jodhpur", tier: "Tier 2", coverage: 70 },
      { city: "Bareilly", tier: "Tier 3", coverage: 82 },
      { city: "Muzaffarpur", tier: "Tier 3", coverage: 80 },
      { city: "Guntur", tier: "Tier 3", coverage: 77 },
    ],
  },
];

export const leaderboardCategories = [
  { id: "composite", label: "Composite" },
  { id: "helpfulness", label: "Helpfulness" },
  { id: "support", label: "Support" },
  { id: "relatability", label: "Relatability" },
];

export const reviewOfTheDay = {
  date: "21 Mar 2026",
  platform: "OYO",
  title: "Midnight check-in failed despite confirmed booking",
  story:
    "Traveler reached Cuttack at 12:40 AM, but property denied the reservation. Support routed through bot loops for 23 minutes before manual intervention.",
  impact: "Support score impact: -9 this week",
  shareSlug: "midnight-checkin-failure-oyo",
};

export const trendingSignals = [
  {
    id: 1,
    platform: "OYO",
    source: "X",
    sentiment: "negative",
    text: "Many users reporting denied check-ins after midnight in Tier 3 towns.",
    ago: "4m ago",
  },
  {
    id: 2,
    platform: "Aorta Rooms",
    source: "X",
    sentiment: "positive",
    text: "Escalation team solved double-charge case in under 30 minutes.",
    ago: "9m ago",
  },
  {
    id: 3,
    platform: "MakeMyTrip",
    source: "X",
    sentiment: "neutral",
    text: "Pilgrimage route packages praised but cancellation TAT flagged.",
    ago: "17m ago",
  },
  {
    id: 4,
    platform: "Cleartrip",
    source: "X",
    sentiment: "positive",
    text: "Price lock reliability trend improving for family bookings.",
    ago: "25m ago",
  },
];

export const reviewArchive = [
  {
    date: "2026-03-21",
    platform: "OYO",
    type: "Horror Story",
    title: "Midnight check-in failure",
    summary: "Confirmed booking denied at property; support bottleneck.",
  },
  {
    date: "2026-03-20",
    platform: "Aorta Rooms",
    type: "Positive Signal",
    title: "Refund reversed in one hour",
    summary: "Agent ownership and callback resolution praised.",
  },
  {
    date: "2026-03-19",
    platform: "MakeMyTrip",
    type: "Positive Signal",
    title: "Price lock worked under surge",
    summary: "No hidden fee between search and checkout.",
  },
  {
    date: "2026-03-18",
    platform: "Yatra",
    type: "Horror Story",
    title: "Refund delayed after cancellation",
    summary: "Two manual escalations needed.",
  },
  {
    date: "2026-03-17",
    platform: "Cleartrip",
    type: "Positive Signal",
    title: "Rebooked flight in 12 minutes",
    summary: "Support chat handled itinerary mismatch quickly.",
  },
  {
    date: "2026-03-16",
    platform: "OYO",
    type: "Horror Story",
    title: "Hotel denied confirmed reservation",
    summary: "Manual rebooking with partial credit only.",
  },
  {
    date: "2026-03-15",
    platform: "MakeMyTrip",
    type: "Positive Signal",
    title: "Family trip booking with zero payment friction",
    summary: "Fast checkout and invoice clarity.",
  },
  {
    date: "2026-03-14",
    platform: "Yatra",
    type: "Positive Signal",
    title: "Support corrected wrong passenger name",
    summary: "Issue resolved pre-departure.",
  },
  {
    date: "2026-03-13",
    platform: "Cleartrip",
    type: "Horror Story",
    title: "Wallet credit not applied",
    summary: "Billing mismatch during final step.",
  },
  {
    date: "2026-03-12",
    platform: "Aorta Rooms",
    type: "Positive Signal",
    title: "Regional language support saved booking",
    summary: "Voice callback in local language resolved confusion.",
  },
];

export const patternReports = [
  {
    title: "Common refund failures in the last 90 days",
    insight:
      "42% of delayed refunds came from cancellation requests initiated after 10 PM local time.",
  },
  {
    title: "Denied check-in trend",
    insight:
      "Tier 3 check-in denial reports are 1.8x higher on weekend nights for low-score platforms.",
  },
  {
    title: "Positive signal pattern",
    insight:
      "Fast first-human response under 10 minutes correlates with 33% fewer re-opened complaints.",
  },
];

export const deepDives = {
  support: {
    title: "Support Deep-Dive",
    intro:
      "Monthly mystery shopping tests and real incident handling quality, across chat, voice, and escalation layers.",
    monthlyTest: [
      { platform: "Aorta Rooms", score: 89, response: "4m" },
      { platform: "MakeMyTrip", score: 77, response: "9m" },
      { platform: "Cleartrip", score: 74, response: "11m" },
      { platform: "Yatra", score: 70, response: "15m" },
      { platform: "OYO", score: 54, response: "29m" },
    ],
  },
  relatability: {
    title: "Relatability Deep-Dive",
    intro:
      "Built for Bharat scoring across language support, local context, and city-tier experience relevance.",
    ranking: [
      { platform: "Aorta Rooms", score: 85 },
      { platform: "MakeMyTrip", score: 81 },
      { platform: "Cleartrip", score: 78 },
      { platform: "Yatra", score: 77 },
      { platform: "OYO", score: 66 },
    ],
  },
  helpfulness: {
    title: "Helpfulness Deep-Dive",
    intro:
      "How easy booking feels in practice: pricing honesty, friction points, and mobile checkout confidence.",
    audits: [
      {
        metric: "Price transparency",
        note: "MakeMyTrip and Aorta Rooms show lowest final-step mismatch rates.",
      },
      {
        metric: "Booking friction",
        note: "OYO and Yatra have higher drop-off in payment confirmation screens.",
      },
      {
        metric: "Mobile experience",
        note: "Cleartrip and Aorta Rooms lead in transaction reliability on low-bandwidth networks.",
      },
    ],
  },
};

export const weeklyRoundup = {
  weekLabel: "Week 12, 2026",
  statOfTheWeek:
    "42% of OYO complaints this week mentioned denied check-in despite confirmed voucher.",
  movements: [
    { platform: "Aorta Rooms", delta: +2, reason: "Escalation speed improved" },
    { platform: "MakeMyTrip", delta: +1, reason: "Lower checkout mismatch" },
    { platform: "Cleartrip", delta: +1, reason: "Faster first response" },
    { platform: "Yatra", delta: -1, reason: "Refund delay complaints rose" },
    {
      platform: "OYO",
      delta: -3,
      reason: "Spike in denied check-in incidents",
    },
  ],
};

export function rankedBy(category = "composite") {
  return [...platforms]
    .sort((a, b) => b.scores[category] - a.scores[category])
    .slice(0, 5)
    .map((platform, index) => ({
      rank: index + 1,
      id: platform.id,
      name: platform.name,
      score: platform.scores[category],
      support: platform.responseTime,
      coverage: platform.cityCoverage,
    }));
}

export function getPlatformById(id) {
  return platforms.find((platform) => platform.id === id);
}
