import type { MarketCode } from "@/data/markets";

// Mock catalogue for Screen 2. Prices are GBP and converted per market.
// Product props are shaped the way the API would return them, so swapping in a
// real search backend later should not touch the components.

export type CategorySlug =
  | "new-in"
  | "fashion"
  | "beadwork-jewellery"
  | "bags"
  | "footwear"
  | "home-living"
  | "beauty"
  | "art";

export type Country = "Nigeria" | "Ghana" | "Kenya" | "Senegal";

export type Product = {
  id: string;
  name: string;
  creator: string;
  country: Country;
  verified: boolean;
  priceGBP: number;
  rating: number;
  reviews: number;
  /** null means ready to ship — no production time. */
  delivery: { minDays: number; maxDays: number } | null;
  category: CategorySlug;
  /** Matches a label in the category's type facet. */
  type: string;
  customSizes: boolean;
  shipsTo: MarketCode[];
  /** Tonal stand-in until product photography lands. */
  tone: string;
  addedDaysAgo: number;
  /** Colourways the creator offers, first is the default. None means one look. */
  colours?: Colour[];
  /** Overrides the sizes the category would offer. */
  sizes?: string[];
  /** How many photos the listing has. Defaults to four. */
  photos?: number;
  /** Set when the last one sells — a cart holding it has to say so. */
  soldOut?: boolean;
  /** For ready pieces in short supply: "3 left". */
  stockLeft?: number;
  /** The price before a reduction, so saved lists can say it dropped. */
  priceWasGBP?: number;
};

export type Colour = { name: string; hex: string };

export type Creator = {
  slug: string;
  name: string;
  /** How copy addresses them: "Note to Yinka", "Kofi has 3 similar pieces". */
  shortName: string;
  city: string;
  country: Country;
  verified: boolean;
  craft: string;
  rating: number;
  reviews: number;
  /**
   * Size of the whole shop, as the storefront would report it. Like the facet
   * counts, this is the designer's figure, not a count of the mock catalogue.
   */
  pieceCount: number;
  followers: number;
  tone: string;
  /** One parcel from this creator, in GBP. */
  shipping: { domesticGBP: number; internationalGBP: number };
  /** Time in transit once a piece is made, or straight away if it is ready. */
  transitDays: { minDays: number; maxDays: number };
  /** Ready pieces leave the workshop within this many days. */
  dispatchDays: number;
  /**
   * FITS confirms identity before a shop can take orders. Separate from the
   * paid verified badge: a shop can be confirmed without the badge.
   */
  identity: "confirmed" | "pending";
  /** "On FITS since 2024". */
  memberSince: number;
  /** Set for a brand-new shop, which says "joined 3 days ago" instead. */
  joinedDaysAgo?: number;
  /** Share of orders that arrived inside the promised window. Unset until there are orders. */
  onTimeRate?: number;
  /** Typical time to answer a message. Unset until there are messages. */
  replyHours?: number;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Short label for the homepage craft tray, where "Home & living" is too long. */
  shortName?: string;
  /** Total the full catalogue would report, as the homepage tray shows it. */
  pieceCount: number;
  /** Type facet, with the counts the full catalogue would report. */
  types: { label: string; count: number }[];
};

export const categories: Category[] = [
  { slug: "new-in", name: "New in", pieceCount: 318, types: [] },
  {
    slug: "fashion",
    name: "Fashion",
    pieceCount: 1240,
    types: [
      { label: "Dresses & kaftans", count: 412 },
      { label: "Two-piece sets", count: 238 },
      { label: "Tops & shirts", count: 301 },
      { label: "Wrappers & fabric", count: 189 },
      { label: "Agbada & menswear", count: 100 },
      { label: "Outerwear", count: 74 },
      { label: "Headwraps & gele", count: 63 },
      { label: "Childrenswear", count: 41 },
    ],
  },
  {
    slug: "beadwork-jewellery",
    name: "Beadwork & jewellery",
    shortName: "Beadwork",
    pieceCount: 466,
    types: [
      { label: "Waist beads", count: 186 },
      { label: "Necklaces", count: 164 },
      { label: "Cuffs & bangles", count: 121 },
      { label: "Earrings", count: 98 },
    ],
  },
  {
    slug: "bags",
    name: "Bags",
    pieceCount: 392,
    types: [
      { label: "Totes", count: 142 },
      { label: "Clutches", count: 96 },
      { label: "Crossbody", count: 71 },
    ],
  },
  {
    slug: "footwear",
    name: "Footwear",
    pieceCount: 308,
    types: [
      { label: "Sandals", count: 133 },
      { label: "Mules & slides", count: 88 },
      { label: "Loafers", count: 52 },
    ],
  },
  {
    slug: "home-living",
    name: "Home & living",
    shortName: "Home",
    pieceCount: 271,
    types: [
      { label: "Throws & blankets", count: 117 },
      { label: "Cushions", count: 84 },
      { label: "Baskets", count: 69 },
    ],
  },
  {
    slug: "beauty",
    name: "Beauty",
    pieceCount: 154,
    types: [
      { label: "Body oils & butters", count: 92 },
      { label: "Soaps", count: 61 },
    ],
  },
  {
    slug: "art",
    name: "Art",
    pieceCount: 194,
    types: [
      { label: "Wall art", count: 108 },
      { label: "Sculpture", count: 47 },
      { label: "Prints", count: 39 },
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export const countryFacets: { country: Country; count: number }[] = [
  { country: "Nigeria", count: 612 },
  { country: "Ghana", count: 284 },
  { country: "Kenya", count: 197 },
  { country: "Senegal", count: 147 },
];

const ALL: MarketCode[] = ["GB", "NG", "GH", "US"];
const AFRICA: MarketCode[] = ["NG", "GH"];
/** Yinka has not opened Ghana, as the product page designs show. */
const YINKA: MarketCode[] = ["NG", "GB", "US"];
/** The few shops that already send to Canada. */
const WITH_CANADA: MarketCode[] = [...ALL, "CA"];

export const creators: Creator[] = [
  {
    slug: "yinka-adeyemi",
    name: "Yinka Adeyemi",
    shortName: "Yinka",
    city: "Ilorin",
    country: "Nigeria",
    verified: true,
    craft: "Adire and aso-oke",
    rating: 4.9,
    reviews: 312,
    pieceCount: 214,
    followers: 3200,
    tone: "bg-[#6E2434]",
    shipping: { domesticGBP: 2, internationalGBP: 9 },
    transitDays: { minDays: 4, maxDays: 6 },
    dispatchDays: 2,
    identity: "confirmed",
    memberSince: 2024,
    onTimeRate: 96,
    replyHours: 4,
  },
  {
    slug: "adire-lab-abeokuta",
    name: "Adire Lab Abeokuta",
    shortName: "Adire Lab",
    city: "Abeokuta",
    country: "Nigeria",
    verified: true,
    craft: "Indigo dyeing",
    rating: 4.8,
    reviews: 140,
    pieceCount: 88,
    followers: 1400,
    tone: "bg-[#2C3E6B]",
    shipping: { domesticGBP: 2, internationalGBP: 9 },
    transitDays: { minDays: 4, maxDays: 6 },
    dispatchDays: 2,
    identity: "confirmed",
    memberSince: 2024,
    onTimeRate: 94,
    replyHours: 6,
  },
  {
    slug: "awa-diop",
    name: "Awa Diop",
    shortName: "Awa",
    city: "Dakar",
    country: "Senegal",
    verified: false,
    craft: "Batik and raffia",
    rating: 0,
    reviews: 0,
    pieceCount: 6,
    followers: 14,
    tone: "bg-[#8C5A3C]",
    shipping: { domesticGBP: 3, internationalGBP: 12 },
    transitDays: { minDays: 6, maxDays: 9 },
    dispatchDays: 3,
    identity: "pending",
    memberSince: 2026,
    joinedDaysAgo: 3,
  },
  {
    slug: "kofi-ampah-studio",
    name: "Kofi Ampah Studio",
    shortName: "Kofi",
    city: "Kumasi",
    country: "Ghana",
    verified: true,
    craft: "Kente and adinkra prints",
    rating: 4.7,
    reviews: 188,
    pieceCount: 103,
    followers: 2100,
    tone: "bg-[#7A5A1E]",
    shipping: { domesticGBP: 2, internationalGBP: 11 },
    transitDays: { minDays: 3, maxDays: 6 },
    dispatchDays: 2,
    identity: "confirmed",
    memberSince: 2023,
    onTimeRate: 93,
    replyHours: 5,
  },
  {
    slug: "akosua-mensah",
    name: "Akosua Mensah",
    shortName: "Akosua",
    city: "Accra",
    country: "Ghana",
    verified: true,
    craft: "Knitwear and baskets",
    rating: 4.8,
    reviews: 177,
    pieceCount: 64,
    followers: 1100,
    tone: "bg-[#8A6A2F]",
    shipping: { domesticGBP: 2, internationalGBP: 11 },
    transitDays: { minDays: 3, maxDays: 6 },
    dispatchDays: 1,
    identity: "confirmed",
    memberSince: 2024,
    onTimeRate: 97,
    replyHours: 3,
  },
  {
    slug: "fatima-bello-beads",
    name: "Fatima Bello Beads",
    shortName: "Fatima",
    city: "Kano",
    country: "Nigeria",
    verified: true,
    craft: "Wedding and waist beads",
    rating: 4.9,
    reviews: 285,
    pieceCount: 140,
    followers: 2700,
    tone: "bg-[#C08B3E]",
    shipping: { domesticGBP: 2, internationalGBP: 7 },
    transitDays: { minDays: 4, maxDays: 6 },
    dispatchDays: 2,
    identity: "confirmed",
    memberSince: 2023,
    onTimeRate: 98,
    replyHours: 2,
  },
  {
    slug: "wanjiru-leather",
    name: "Wanjiru Leather",
    shortName: "Wanjiru",
    city: "Nairobi",
    country: "Kenya",
    verified: true,
    craft: "Hand-stitched leather",
    rating: 4.8,
    reviews: 119,
    pieceCount: 46,
    followers: 860,
    tone: "bg-[#8B5A2B]",
    shipping: { domesticGBP: 3, internationalGBP: 12 },
    transitDays: { minDays: 5, maxDays: 8 },
    dispatchDays: 2,
    identity: "confirmed",
    memberSince: 2024,
    onTimeRate: 95,
    replyHours: 8,
  },
  {
    slug: "adaeze-crochet",
    name: "Adaeze Crochet",
    shortName: "Adaeze",
    city: "Enugu",
    country: "Nigeria",
    verified: true,
    craft: "Crochet and knit",
    rating: 4.8,
    reviews: 249,
    pieceCount: 72,
    followers: 1900,
    tone: "bg-[#C9AE8E]",
    shipping: { domesticGBP: 2, internationalGBP: 9 },
    transitDays: { minDays: 4, maxDays: 6 },
    dispatchDays: 2,
    identity: "confirmed",
    memberSince: 2024,
    onTimeRate: 96,
    replyHours: 4,
  },
  {
    slug: "kwame-osei",
    name: "Kwame Osei",
    shortName: "Kwame",
    city: "Tamale",
    country: "Ghana",
    verified: false,
    craft: "Prints, soaps and carving",
    rating: 4.5,
    reviews: 101,
    pieceCount: 38,
    followers: 310,
    tone: "bg-[#B4702C]",
    shipping: { domesticGBP: 2, internationalGBP: 10 },
    transitDays: { minDays: 4, maxDays: 7 },
    dispatchDays: 3,
    identity: "confirmed",
    memberSince: 2025,
    onTimeRate: 88,
    replyHours: 12,
  },
];

export const products: Product[] = [
  // --- Fashion -------------------------------------------------------------
  {
    id: "indigo-adire-kaftan",
    name: "Indigo adire kaftan",
    creator: "Yinka Adeyemi",
    country: "Nigeria",
    verified: true,
    priceGBP: 27,
    rating: 4.9,
    reviews: 86,
    delivery: { minDays: 12, maxDays: 14 },
    category: "fashion",
    type: "Dresses & kaftans",
    customSizes: true,
    shipsTo: YINKA,
    tone: "bg-[#6E2434]",
    addedDaysAgo: 4,
    photos: 9,
    colours: [
      { name: "Deep indigo", hex: "#1F2A5C" },
      { name: "Sky indigo", hex: "#5B7DB1" },
      { name: "Rust", hex: "#A85F32" },
    ],
  },
  {
    id: "aso-oke-wrap-dress",
    name: "Aso-oke wrap dress",
    creator: "Yinka Adeyemi",
    country: "Nigeria",
    verified: true,
    priceGBP: 29,
    priceWasGBP: 34,
    rating: 4.8,
    reviews: 41,
    delivery: { minDays: 14, maxDays: 14 },
    category: "fashion",
    type: "Dresses & kaftans",
    customSizes: true,
    shipsTo: YINKA,
    tone: "bg-[#1F4E79]",
    addedDaysAgo: 9,
    colours: [
      { name: "Blue and wine", hex: "#1F4E79" },
      { name: "Gold and cream", hex: "#C9A35B" },
    ],
  },
  {
    id: "two-piece-knit-set",
    name: "Two-piece knit set",
    creator: "Akosua Mensah",
    country: "Ghana",
    verified: true,
    priceGBP: 23,
    rating: 4.7,
    reviews: 29,
    delivery: null,
    category: "fashion",
    type: "Two-piece sets",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#8A6A2F]",
    addedDaysAgo: 2,
    colours: [
      { name: "Ochre", hex: "#B8862F" },
      { name: "Forest", hex: "#2F5A4C" },
    ],
  },
  {
    id: "kente-wrap-skirt",
    name: "Kente wrap skirt",
    creator: "Akosua Mensah",
    country: "Ghana",
    verified: true,
    priceGBP: 31,
    rating: 4.8,
    reviews: 57,
    delivery: { minDays: 9, maxDays: 12 },
    category: "fashion",
    type: "Wrappers & fabric",
    customSizes: true,
    shipsTo: ALL,
    tone: "bg-[#A8541F]",
    addedDaysAgo: 16,
  },
  {
    id: "embroidered-agbada",
    name: "Embroidered agbada, three piece",
    creator: "Yinka Adeyemi",
    country: "Nigeria",
    verified: true,
    priceGBP: 78,
    rating: 4.9,
    reviews: 73,
    delivery: { minDays: 18, maxDays: 21 },
    category: "fashion",
    type: "Agbada & menswear",
    customSizes: true,
    shipsTo: YINKA,
    tone: "bg-[#2F5A4C]",
    addedDaysAgo: 23,
  },
  {
    id: "ankara-shirt",
    name: "Ankara short-sleeve shirt",
    creator: "Kwame Osei",
    country: "Ghana",
    verified: false,
    priceGBP: 19,
    rating: 4.4,
    reviews: 22,
    delivery: { minDays: 7, maxDays: 9 },
    category: "fashion",
    type: "Tops & shirts",
    customSizes: false,
    shipsTo: AFRICA,
    tone: "bg-[#B4702C]",
    addedDaysAgo: 1,
  },
  {
    id: "gele-headwrap",
    name: "Aso-oke gele, pre-tied",
    creator: "Fatima Bello Beads",
    country: "Nigeria",
    verified: true,
    priceGBP: 14,
    rating: 4.7,
    reviews: 48,
    delivery: null,
    category: "fashion",
    type: "Headwraps & gele",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#8C3C52]",
    addedDaysAgo: 6,
  },
  {
    id: "adire-kimono-jacket",
    name: "Adire kimono jacket",
    creator: "Adaeze Crochet",
    country: "Nigeria",
    verified: true,
    priceGBP: 42,
    rating: 4.6,
    reviews: 31,
    delivery: { minDays: 10, maxDays: 13 },
    category: "fashion",
    type: "Outerwear",
    customSizes: true,
    shipsTo: ALL,
    tone: "bg-[#3B5E7A]",
    addedDaysAgo: 12,
  },
  {
    id: "kente-trim-two-piece",
    name: "Kente-trim two-piece",
    creator: "Kofi Ampah Studio",
    country: "Ghana",
    verified: true,
    priceGBP: 23,
    rating: 4.7,
    reviews: 38,
    delivery: null,
    category: "fashion",
    type: "Two-piece sets",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#7A5A1E]",
    addedDaysAgo: 3,
    colours: [{ name: "Gold and green", hex: "#B08A2E" }],
  },
  {
    id: "adinkra-print-shirt",
    name: "Adinkra print shirt",
    creator: "Kofi Ampah Studio",
    country: "Ghana",
    verified: true,
    priceGBP: 21,
    rating: 4.6,
    reviews: 24,
    delivery: { minDays: 7, maxDays: 10 },
    category: "fashion",
    type: "Tops & shirts",
    customSizes: true,
    shipsTo: ALL,
    tone: "bg-[#3F3A2E]",
    addedDaysAgo: 11,
  },
  {
    id: "adire-fabric-yard",
    name: "Hand-dyed adire fabric, by the yard",
    creator: "Adire Lab Abeokuta",
    country: "Nigeria",
    verified: true,
    priceGBP: 12,
    rating: 4.8,
    reviews: 44,
    delivery: { minDays: 6, maxDays: 9 },
    category: "fashion",
    type: "Wrappers & fabric",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#2C3E6B]",
    addedDaysAgo: 5,
    colours: [
      { name: "Deep indigo", hex: "#1F2A5C" },
      { name: "Sky indigo", hex: "#5B7DB1" },
    ],
  },

  // --- Beadwork & jewellery -----------------------------------------------
  {
    id: "waist-beads",
    name: "Waist beads, custom length",
    creator: "Fatima Bello Beads",
    country: "Nigeria",
    verified: true,
    priceGBP: 4,
    rating: 5,
    reviews: 112,
    delivery: { minDays: 8, maxDays: 8 },
    category: "beadwork-jewellery",
    type: "Waist beads",
    customSizes: true,
    shipsTo: WITH_CANADA,
    tone: "bg-[#C08B3E]",
    addedDaysAgo: 3,
  },
  {
    id: "brass-bead-cuff",
    name: "Brass and bead cuff, pair",
    creator: "Fatima Bello Beads",
    country: "Nigeria",
    verified: true,
    priceGBP: 12,
    rating: 4.9,
    reviews: 58,
    delivery: { minDays: 9, maxDays: 9 },
    category: "beadwork-jewellery",
    type: "Cuffs & bangles",
    customSizes: false,
    shipsTo: WITH_CANADA,
    tone: "bg-[#2E7C8A]",
    addedDaysAgo: 8,
    stockLeft: 2,
  },
  {
    id: "layered-bead-necklace",
    name: "Layered bead necklace",
    creator: "Fatima Bello Beads",
    country: "Nigeria",
    verified: true,
    priceGBP: 22,
    rating: 4.8,
    reviews: 67,
    delivery: { minDays: 6, maxDays: 8 },
    category: "beadwork-jewellery",
    type: "Necklaces",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#9C6B2E]",
    addedDaysAgo: 19,
  },
  {
    id: "cowrie-earrings",
    name: "Cowrie drop earrings",
    creator: "Awa Diop",
    country: "Senegal",
    verified: false,
    priceGBP: 9,
    rating: 0,
    reviews: 0,
    delivery: null,
    category: "beadwork-jewellery",
    type: "Earrings",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#6D7F5B]",
    addedDaysAgo: 5,
  },

  {
    id: "coral-wedding-bead-set",
    name: "Coral wedding bead set",
    creator: "Fatima Bello Beads",
    country: "Nigeria",
    verified: true,
    priceGBP: 38,
    rating: 4.9,
    reviews: 41,
    delivery: { minDays: 12, maxDays: 14 },
    category: "beadwork-jewellery",
    type: "Necklaces",
    customSizes: false,
    shipsTo: WITH_CANADA,
    tone: "bg-[#A4472E]",
    addedDaysAgo: 0,
    colours: [
      { name: "Coral", hex: "#C2553A" },
      { name: "Coral and gold", hex: "#C89A3C" },
    ],
  },

  // --- Bags ----------------------------------------------------------------
  {
    id: "leather-tote",
    name: "Hand-stitched leather tote",
    creator: "Wanjiru Leather",
    country: "Kenya",
    verified: true,
    priceGBP: 29,
    rating: 4.9,
    reviews: 64,
    delivery: { minDays: 10, maxDays: 10 },
    category: "bags",
    type: "Totes",
    customSizes: false,
    shipsTo: WITH_CANADA,
    tone: "bg-[#8B5A2B]",
    addedDaysAgo: 7,
  },
  {
    id: "raffia-clutch",
    name: "Raffia evening clutch",
    creator: "Awa Diop",
    country: "Senegal",
    verified: false,
    priceGBP: 17,
    rating: 0,
    reviews: 0,
    delivery: { minDays: 13, maxDays: 16 },
    category: "bags",
    type: "Clutches",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#B08968]",
    addedDaysAgo: 14,
  },
  {
    id: "beaded-crossbody",
    name: "Beaded crossbody bag",
    creator: "Wanjiru Leather",
    country: "Kenya",
    verified: true,
    priceGBP: 24,
    rating: 4.6,
    reviews: 18,
    delivery: null,
    category: "bags",
    type: "Crossbody",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#7A4B2A]",
    addedDaysAgo: 21,
  },

  // --- Footwear ------------------------------------------------------------
  {
    id: "leather-mule-sandals",
    name: "Leather mule sandals",
    creator: "Wanjiru Leather",
    country: "Kenya",
    verified: true,
    priceGBP: 16,
    rating: 4.6,
    reviews: 37,
    delivery: null,
    category: "footwear",
    type: "Mules & slides",
    customSizes: true,
    shipsTo: ALL,
    tone: "bg-[#5C4033]",
    addedDaysAgo: 11,
  },
  {
    id: "woven-sandals",
    name: "Woven leather sandals",
    creator: "Kwame Osei",
    country: "Ghana",
    verified: false,
    priceGBP: 21,
    rating: 4.3,
    reviews: 15,
    delivery: { minDays: 11, maxDays: 14 },
    category: "footwear",
    type: "Sandals",
    customSizes: true,
    shipsTo: AFRICA,
    tone: "bg-[#8A6244]",
    addedDaysAgo: 2,
  },

  // --- Home & living -------------------------------------------------------
  {
    id: "wool-throw",
    name: "Hand-crocheted wool throw",
    creator: "Adaeze Crochet",
    country: "Nigeria",
    verified: true,
    priceGBP: 21,
    rating: 4.9,
    reviews: 218,
    delivery: { minDays: 11, maxDays: 11 },
    category: "home-living",
    type: "Throws & blankets",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#C9AE8E]",
    addedDaysAgo: 10,
  },
  {
    id: "mudcloth-cushions",
    name: "Mudcloth cushion covers, pair",
    creator: "Awa Diop",
    country: "Senegal",
    verified: false,
    priceGBP: 26,
    rating: 0,
    reviews: 0,
    delivery: { minDays: 15, maxDays: 18 },
    category: "home-living",
    type: "Cushions",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#6B5B4A]",
    addedDaysAgo: 26,
  },
  {
    id: "adire-cushion-covers",
    name: "Adire cushion covers",
    creator: "Adire Lab Abeokuta",
    country: "Nigeria",
    verified: true,
    priceGBP: 19,
    rating: 4.7,
    reviews: 27,
    delivery: { minDays: 8, maxDays: 11 },
    category: "home-living",
    type: "Cushions",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#34507A]",
    addedDaysAgo: 9,
  },
  {
    id: "adire-cushion-pair",
    name: "Adire cushion pair",
    creator: "Yinka Adeyemi",
    country: "Nigeria",
    verified: true,
    priceGBP: 19,
    rating: 4.6,
    reviews: 18,
    delivery: null,
    category: "home-living",
    type: "Cushions",
    customSizes: false,
    shipsTo: YINKA,
    tone: "bg-[#7A2E3B]",
    addedDaysAgo: 1,
    stockLeft: 3,
  },
  {
    id: "raffia-placemats",
    name: "Raffia placemats, 4",
    creator: "Awa Diop",
    country: "Senegal",
    verified: false,
    priceGBP: 14,
    rating: 0,
    reviews: 0,
    delivery: { minDays: 14, maxDays: 17 },
    category: "home-living",
    type: "Baskets",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#C4A574]",
    addedDaysAgo: 2,
  },
  {
    id: "bolga-basket",
    name: "Bolga market basket",
    creator: "Akosua Mensah",
    country: "Ghana",
    verified: true,
    priceGBP: 33,
    rating: 4.9,
    reviews: 91,
    delivery: { minDays: 12, maxDays: 15 },
    category: "home-living",
    type: "Baskets",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#A98B5F]",
    addedDaysAgo: 18,
  },

  {
    id: "crochet-throw-blush",
    name: "Crochet throw, blush",
    creator: "Adaeze Crochet",
    country: "Nigeria",
    verified: true,
    priceGBP: 42,
    rating: 4.8,
    reviews: 22,
    delivery: null,
    category: "home-living",
    type: "Throws & blankets",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#D9B8A8]",
    addedDaysAgo: 40,
    soldOut: true,
  },

  // --- Beauty --------------------------------------------------------------
  {
    id: "shea-body-butter",
    name: "Raw shea body butter",
    creator: "Akosua Mensah",
    country: "Ghana",
    verified: true,
    priceGBP: 8,
    rating: 4.8,
    reviews: 134,
    delivery: null,
    category: "beauty",
    type: "Body oils & butters",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#C2A878]",
    addedDaysAgo: 1,
  },
  {
    id: "black-soap",
    name: "African black soap, set of three",
    creator: "Kwame Osei",
    country: "Ghana",
    verified: false,
    priceGBP: 11,
    rating: 4.5,
    reviews: 52,
    delivery: { minDays: 7, maxDays: 10 },
    category: "beauty",
    type: "Soaps",
    customSizes: false,
    shipsTo: AFRICA,
    tone: "bg-[#4A3B2F]",
    addedDaysAgo: 13,
  },

  // --- Art -----------------------------------------------------------------
  {
    id: "raffia-wall-set",
    name: "Woven raffia wall set",
    creator: "Awa Diop",
    country: "Senegal",
    verified: false,
    priceGBP: 18,
    rating: 0,
    reviews: 0,
    delivery: { minDays: 18, maxDays: 18 },
    category: "art",
    type: "Wall art",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#8C5A3C]",
    addedDaysAgo: 15,
  },
  {
    id: "batik-wall-hanging",
    name: "Batik wall hanging",
    creator: "Awa Diop",
    country: "Senegal",
    verified: false,
    priceGBP: 21,
    rating: 0,
    reviews: 0,
    delivery: { minDays: 16, maxDays: 21 },
    category: "art",
    type: "Wall art",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#5E3B2E]",
    addedDaysAgo: 3,
  },
  {
    id: "carved-figure",
    name: "Hand-carved ebony figure",
    creator: "Kwame Osei",
    country: "Ghana",
    verified: false,
    priceGBP: 54,
    rating: 4.7,
    reviews: 12,
    delivery: { minDays: 20, maxDays: 25 },
    category: "art",
    type: "Sculpture",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#3E342C]",
    addedDaysAgo: 29,
  },
];

/** "New in" is a view over everything rather than a category of its own. */
export function productsForCategory(slug: CategorySlug) {
  if (slug === "new-in") {
    return [...products].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
  }
  return products.filter((product) => product.category === slug);
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function getCreatorBySlug(slug: string) {
  return creators.find((creator) => creator.slug === slug);
}

/** Every product names its creator, so this only misses on bad fixture data. */
export function creatorOf(product: Product): Creator {
  const creator = creators.find((item) => item.name === product.creator);
  if (!creator) {
    throw new Error(`No creator profile for "${product.creator}"`);
  }
  return creator;
}

export function productsByCreator(name: string) {
  return products.filter((product) => product.creator === name);
}

const LETTER_SIZES = ["XS", "S", "M", "L", "XL"];
const SHOE_SIZES = ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9"];
/** Sold by length or one size, so there is nothing to choose. */
const UNSIZED_TYPES = ["Wrappers & fabric", "Headwraps & gele"];

/** The size options a piece is offered in; empty means one size. */
export function sizesFor(product: Product): string[] {
  if (product.sizes) return product.sizes;
  if (product.category === "footwear") return SHOE_SIZES;
  if (product.category === "fashion" && !UNSIZED_TYPES.includes(product.type)) {
    return LETTER_SIZES;
  }
  return [];
}

/**
 * Made-to-measure needs body measurements, so it is offered on clothing only.
 * Other pieces flagged `customSizes` (bead lengths, shoe widths) take a note.
 */
export function offersMeasurements(product: Product) {
  return (
    product.customSizes &&
    product.category === "fashion" &&
    sizesFor(product).length > 0
  );
}

/** A shop can be browsed before its identity is confirmed, but not ordered from. */
export function isOpenForOrders(creator: Creator) {
  return creator.identity === "confirmed";
}
