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
    shipsTo: ALL,
    tone: "bg-[#6E2434]",
    addedDaysAgo: 4,
  },
  {
    id: "aso-oke-wrap-dress",
    name: "Aso-oke wrap dress",
    creator: "Yinka Adeyemi",
    country: "Nigeria",
    verified: true,
    priceGBP: 34,
    rating: 4.8,
    reviews: 41,
    delivery: { minDays: 14, maxDays: 14 },
    category: "fashion",
    type: "Dresses & kaftans",
    customSizes: true,
    shipsTo: ALL,
    tone: "bg-[#1F4E79]",
    addedDaysAgo: 9,
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
    shipsTo: ALL,
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
    shipsTo: ALL,
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
    shipsTo: ALL,
    tone: "bg-[#2E7C8A]",
    addedDaysAgo: 8,
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
    verified: true,
    priceGBP: 9,
    rating: 4.5,
    reviews: 26,
    delivery: null,
    category: "beadwork-jewellery",
    type: "Earrings",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#6D7F5B]",
    addedDaysAgo: 5,
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
    shipsTo: ALL,
    tone: "bg-[#8B5A2B]",
    addedDaysAgo: 7,
  },
  {
    id: "raffia-clutch",
    name: "Raffia evening clutch",
    creator: "Awa Diop",
    country: "Senegal",
    verified: true,
    priceGBP: 17,
    rating: 4.7,
    reviews: 33,
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
    verified: true,
    priceGBP: 26,
    rating: 4.8,
    reviews: 44,
    delivery: { minDays: 15, maxDays: 18 },
    category: "home-living",
    type: "Cushions",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#6B5B4A]",
    addedDaysAgo: 26,
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
    verified: true,
    priceGBP: 18,
    rating: 4.8,
    reviews: 19,
    delivery: { minDays: 18, maxDays: 18 },
    category: "art",
    type: "Wall art",
    customSizes: false,
    shipsTo: ALL,
    tone: "bg-[#8C5A3C]",
    addedDaysAgo: 15,
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
