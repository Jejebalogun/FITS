import { convert, formatAmount, type Market } from "@/data/markets";
import type { Country, Product } from "@/data/marketplace";

/** Upper bound of the price filter, in GBP. At the top the range means "and up". */
export const PRICE_MAX_GBP = 250;

export type SortKey =
  | "relevant"
  | "recommended"
  | "arriving"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "arriving", label: "Arrives soonest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
  { key: "newest", label: "Newest" },
];

/** Search leads with relevance, which is the order results arrive in. */
export const searchSortOptions: { key: SortKey; label: string }[] = [
  { key: "relevant", label: "Most relevant" },
  ...sortOptions.filter((option) => option.key !== "recommended"),
];

export type Filters = {
  types: string[];
  minGBP: number;
  maxGBP: number;
  /** Arrives within N days, or null for any. */
  withinDays: number | null;
  countries: Country[];
  verifiedOnly: boolean;
  shipsToMarket: boolean;
  customSizes: boolean;
  /** Minimum star rating, or null for any. */
  minRating: number | null;
};

export const emptyFilters: Filters = {
  types: [],
  minGBP: 0,
  maxGBP: PRICE_MAX_GBP,
  withinDays: null,
  countries: [],
  verifiedOnly: false,
  shipsToMarket: false,
  customSizes: false,
  minRating: null,
};

/** Worst-case days to arrive; ready-to-ship counts as zero. */
export function daysToArrive(product: Product) {
  return product.delivery ? product.delivery.maxDays : 0;
}

export function applyFilters(
  products: Product[],
  filters: Filters,
  market: Market,
) {
  return products.filter((product) => {
    if (filters.types.length && !filters.types.includes(product.type)) {
      return false;
    }
    if (product.priceGBP < filters.minGBP) return false;
    // At the top of the range the filter means "and up", so skip the ceiling.
    if (filters.maxGBP < PRICE_MAX_GBP && product.priceGBP > filters.maxGBP) {
      return false;
    }
    if (filters.withinDays !== null && daysToArrive(product) > filters.withinDays) {
      return false;
    }
    if (filters.countries.length && !filters.countries.includes(product.country)) {
      return false;
    }
    if (filters.verifiedOnly && !product.verified) return false;
    if (filters.shipsToMarket && !product.shipsTo.includes(market.code)) {
      return false;
    }
    if (filters.customSizes && !product.customSizes) return false;
    if (filters.minRating !== null && product.rating < filters.minRating) {
      return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceGBP - b.priceGBP);
    case "price-desc":
      return sorted.sort((a, b) => b.priceGBP - a.priceGBP);
    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      );
    case "newest":
      return sorted.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
    case "arriving":
      return sorted.sort((a, b) => daysToArrive(a) - daysToArrive(b));
    case "relevant":
      return sorted;
    case "recommended":
    default:
      // Verified first, then rating weighted by how many people rated it.
      return sorted.sort(
        (a, b) =>
          Number(b.verified) - Number(a.verified) ||
          b.rating * Math.log10(b.reviews + 10) -
            a.rating * Math.log10(a.reviews + 10),
      );
  }
}

export function countActiveFilters(filters: Filters) {
  let count = filters.types.length + filters.countries.length;
  if (filters.minGBP > 0 || filters.maxGBP < PRICE_MAX_GBP) count += 1;
  if (filters.withinDays !== null) count += 1;
  if (filters.verifiedOnly) count += 1;
  if (filters.shipsToMarket) count += 1;
  if (filters.customSizes) count += 1;
  if (filters.minRating !== null) count += 1;
  return count;
}

/** One active filter, described for a chip and for a sentence. */
export type FilterPart = {
  key: string;
  /** Chip text: "Arrives within 21 days". */
  label: string;
  /** How a sentence names it: "the delivery window". */
  noun: string;
  kind: "type" | "other";
  /** The filters with just this one taken off. */
  without: Filters;
};

export function priceLabel(filters: Filters, market: Market) {
  return `${formatAmount(convert(filters.minGBP, market), market)} – ${formatAmount(
    convert(filters.maxGBP, market),
    market,
  )}${filters.maxGBP >= PRICE_MAX_GBP ? "+" : ""}`;
}

export function filterParts(filters: Filters, market: Market): FilterPart[] {
  const parts: FilterPart[] = filters.types.map((type) => ({
    key: `type:${type}`,
    label: type,
    noun: "the type",
    kind: "type",
    without: { ...filters, types: filters.types.filter((item) => item !== type) },
  }));

  if (filters.minGBP > 0 || filters.maxGBP < PRICE_MAX_GBP) {
    parts.push({
      key: "price",
      label: priceLabel(filters, market),
      noun: "the price range",
      kind: "other",
      without: { ...filters, minGBP: 0, maxGBP: PRICE_MAX_GBP },
    });
  }
  if (filters.withinDays !== null) {
    parts.push({
      key: "within",
      label: `Arrives within ${filters.withinDays} days`,
      noun: "the delivery window",
      kind: "other",
      without: { ...filters, withinDays: null },
    });
  }
  for (const country of filters.countries) {
    parts.push({
      key: `country:${country}`,
      label: country,
      noun: `made in ${country}`,
      kind: "other",
      without: {
        ...filters,
        countries: filters.countries.filter((item) => item !== country),
      },
    });
  }
  if (filters.verifiedOnly) {
    parts.push({
      key: "verified",
      label: "Verified only",
      noun: "verified creators only",
      kind: "other",
      without: { ...filters, verifiedOnly: false },
    });
  }
  if (filters.shipsToMarket) {
    parts.push({
      key: "ships",
      label: `Ships to ${market.placeName}`,
      noun: `shipping to ${market.placeName}`,
      kind: "other",
      without: { ...filters, shipsToMarket: false },
    });
  }
  if (filters.customSizes) {
    parts.push({
      key: "custom",
      label: "Takes custom sizes",
      noun: "custom sizes",
      kind: "other",
      without: { ...filters, customSizes: false },
    });
  }
  if (filters.minRating !== null) {
    parts.push({
      key: "rating",
      label: `${filters.minRating} stars & up`,
      noun: "the rating",
      kind: "other",
      without: { ...filters, minRating: null },
    });
  }
  return parts;
}
