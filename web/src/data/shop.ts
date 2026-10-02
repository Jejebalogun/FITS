// Content for Screen 1, the discovery homepage. Editorial selections are curated
// here rather than computed, which is how the trays are meant to work — a human
// picks what leads, the catalogue supplies the detail.

export type TrendingEntry = {
  productId: string;
  /** Whether the number counts saves or completed orders. */
  metric: "saves" | "ordered";
  count: number;
};

/** "Most saved and ordered by buyers in <market>" — the week's top six. */
export const trending: TrendingEntry[] = [
  { productId: "indigo-adire-kaftan", metric: "saves", count: 312 },
  { productId: "two-piece-knit-set", metric: "saves", count: 206 },
  { productId: "brass-bead-cuff", metric: "ordered", count: 96 },
  { productId: "leather-tote", metric: "ordered", count: 81 },
  { productId: "raffia-wall-set", metric: "saves", count: 140 },
  { productId: "wool-throw", metric: "ordered", count: 74 },
];

/** Hand-picked for the "New from verified creators" tray. */
export const newFromCreators = [
  "waist-beads",
  "wool-throw",
  "leather-mule-sandals",
  "aso-oke-wrap-dress",
];

export type FeedClip = {
  id: string;
  caption: string;
  creator: string;
  /** Runtime, already formatted. */
  length: string;
  tone: string;
};

export const feedClips: FeedClip[] = [
  {
    id: "throw-day-4",
    caption: "Day 4 on the throw",
    creator: "Adaeze",
    length: "0:42",
    tone: "bg-[#C9AE8E]",
  },
  {
    id: "wedding-beads",
    caption: "Stringing wedding beads",
    creator: "Fatima",
    length: "1:05",
    tone: "bg-[#C08B3E]",
  },
  {
    id: "indigo-vat",
    caption: "Indigo vat, second dip",
    creator: "Yinka",
    length: "0:58",
    tone: "bg-[#6E2434]",
  },
  {
    id: "stitching-tote",
    caption: "Hand-stitching the tote",
    creator: "Tunde",
    length: "0:37",
    tone: "bg-[#8B5A2B]",
  },
  {
    id: "knit-set",
    caption: "This season’s knit set",
    creator: "Ngozi",
    length: "0:49",
    tone: "bg-[#8A6A2F]",
  },
];

export type CountryGuide = {
  name: string;
  /** The crafts that country is known for. */
  crafts: string;
  creators: number;
};

export const countryGuides: CountryGuide[] = [
  { name: "Nigeria", crafts: "Adire, aso-oke, beadwork", creators: 612 },
  { name: "Ghana", crafts: "Kente, bolga baskets", creators: 284 },
  { name: "Kenya", crafts: "Leather, kiondo bags", creators: 197 },
  { name: "Senegal", crafts: "Wax print, woven goods", creators: 147 },
  { name: "South Africa", crafts: "Beadwork, ceramics", creators: 131 },
  { name: "Morocco", crafts: "Rugs, leather", creators: 96 },
];

/** The creator card that sits over the hero image. */
export const heroCreator = {
  name: "Yinka Adeyemi",
  country: "Nigeria",
  verified: true,
  delivered: 214,
};

export const spotlight = {
  eyebrow: "Creator spotlight",
  headline:
    "Twenty-six years of wedding beads, and four women who learned from her.",
  body: "Fatima Bello strings the same patterns her mother made for brides in Kofar Mata. This week she tells us how a collar is planned before a single bead is cut.",
  storyHref: "/editorial/fatima-bello",
  shopHref: "/creator/fatima-bello-beads",
  tone: "bg-[#C08B3E]",
};
