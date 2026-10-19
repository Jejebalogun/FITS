import MarketplaceProductCard from "@/components/marketplace/MarketplaceProductCard";
import Pagination from "@/components/marketplace/Pagination";
import type { Product } from "@/data/marketplace";
import type { Layout } from "@/lib/use-product-results";

type ProductResultsProps = {
  products: Product[];
  layout: Layout;
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
};

export default function ProductResults({
  products,
  layout,
  page,
  pageCount,
  onPage,
}: ProductResultsProps) {
  return (
    <>
      <div
        className={
          layout === "grid"
            ? "mt-7 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-3"
            : "mt-7 flex flex-col gap-6"
        }
      >
        {products.map((product) => (
          <MarketplaceProductCard
            key={product.id}
            product={product}
            layout={layout}
          />
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={onPage} />
    </>
  );
}

/** Stands in for the grid until the visitor's currency is known. */
export function ResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="mt-7 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="motion-safe:animate-pulse">
          <div className="aspect-[4/5] rounded-2xl bg-sand/70" />
          <div className="mt-4 h-4 w-2/3 rounded-full bg-sand/70" />
          <div className="mt-3 h-3 w-1/2 rounded-full bg-sand/70" />
          <div className="mt-4 h-4 w-1/4 rounded-full bg-sand/70" />
        </div>
      ))}
    </div>
  );
}
