import type { Product } from "@/data/marketplace";
import type { Filters } from "@/lib/marketplace-filters";

/** "84 pieces from 31 verified creators · all ship to the UK" */
export default function ResultSummary({
  products,
  filters,
  placeName,
}: {
  products: Product[];
  filters: Filters;
  placeName: string;
}) {
  const creators = new Set(products.map((product) => product.creator)).size;
  const countries = new Set(products.map((product) => product.country)).size;

  const pieces = `${products.length} ${products.length === 1 ? "piece" : "pieces"}`;
  const makers = `${creators} ${filters.verifiedOnly ? "verified " : ""}${
    creators === 1 ? "creator" : "creators"
  }`;

  return (
    <>
      {pieces} from {makers}
      {filters.shipsToMarket
        ? ` · all ship to ${placeName}`
        : ` in ${countries} ${countries === 1 ? "country" : "countries"}`}
    </>
  );
}
