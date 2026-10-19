"use client";

import { useRef } from "react";

import ActiveFilterChips from "@/components/marketplace/ActiveFilterChips";
import Breadcrumb from "@/components/marketplace/Breadcrumb";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import GeoBanner from "@/components/marketplace/GeoBanner";
import { useMarket } from "@/components/marketplace/MarketProvider";
import NoMatches from "@/components/marketplace/NoMatches";
import ProductResults, {
  ResultsSkeleton,
} from "@/components/marketplace/ProductResults";
import ResultSummary from "@/components/marketplace/ResultSummary";
import ResultsToolbar from "@/components/marketplace/ResultsToolbar";
import type { Category, Product } from "@/data/marketplace";
import { emptyFilters, sortOptions } from "@/lib/marketplace-filters";
import { useProductResults } from "@/lib/use-product-results";

type CategoryBrowserProps = {
  category: Category;
  products: Product[];
};

export default function CategoryBrowser({
  category,
  products,
}: CategoryBrowserProps) {
  const { market, ready } = useMarket();
  const results = useProductResults(products, "recommended");
  const { filters, update } = results;
  const searchRef = useRef<HTMLDivElement>(null);

  // When exactly one type is chosen the page takes its name, as the designs show.
  const scopedType = filters.types.length === 1 ? filters.types[0] : null;
  const heading = scopedType ?? category.name;

  /** Clears the refinements but stays inside the chosen type, if there is one. */
  function clearRefinements() {
    update(scopedType ? { ...emptyFilters, types: filters.types } : emptyFilters);
  }

  return (
    <>
      <GeoBanner
        onChangeCountry={() =>
          searchRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div className="min-h-screen bg-cream pb-20">
        <div className="mx-auto w-full max-w-[90rem] px-6 pb-5 pt-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: category.name, href: `/category/${category.slug}` },
              ...(scopedType ? [{ label: scopedType }] : []),
            ]}
          />
        </div>

        <div className="mx-auto flex w-full max-w-[90rem] gap-8 px-6">
          <div className="hidden w-[19rem] shrink-0 lg:block">
            <FilterSidebar
              types={category.types}
              filters={filters}
              onChange={update}
              onClear={results.clearAll}
            />
          </div>

          <main className="min-w-0 flex-1" ref={searchRef}>
            {/* Title row */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl text-forest">{heading}</h1>
                <p className="mt-1.5 text-forest/65" aria-live="polite">
                  {!ready ? (
                    "Loading pieces…"
                  ) : results.visible.length === 0 ? (
                    `0 of ${category.pieceCount.toLocaleString("en-GB")} pieces`
                  ) : (
                    <ResultSummary
                      products={results.visible}
                      filters={filters}
                      placeName={market.placeName}
                    />
                  )}
                </p>
              </div>

              <ResultsToolbar
                sort={results.sort}
                options={sortOptions}
                onSort={results.setSort}
                layout={results.layout}
                onLayout={results.setLayout}
              />
            </div>

            <ActiveFilterChips filters={filters} onChange={update} />

            {!ready ? (
              <ResultsSkeleton />
            ) : results.visible.length === 0 ? (
              <NoMatches
                products={products}
                filters={filters}
                onChange={update}
                onClear={clearRefinements}
                browse={
                  scopedType
                    ? {
                        label: `Browse all of ${category.name}`,
                        onClick: results.clearAll,
                      }
                    : undefined
                }
              />
            ) : (
              <>
                <PricePromise
                  placeName={market.placeName}
                  moneyName={market.moneyName}
                />
                <ProductResults
                  products={results.pageItems}
                  layout={results.layout}
                  page={results.page}
                  pageCount={results.pageCount}
                  onPage={results.setPage}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

/** The all-in pricing promise that leads the results. */
function PricePromise({
  placeName,
  moneyName,
}: {
  placeName: string;
  moneyName: string;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl bg-forest-deep">
      <div className="flex items-center">
        <div className="flex-1 p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-clay">
            Your prices
          </p>
          <h2 className="mt-3 font-display text-3xl text-cream">
            Shipping to {placeName}, all in
          </h2>
          <p className="mt-2 text-cream/75">
            Prices in {moneyName}, delivery and duties shown before you pay. Money
            held until it arrives.
          </p>
        </div>
        <div
          aria-hidden
          className="hidden h-44 w-72 shrink-0 bg-clay-soft/30 md:block"
        />
      </div>
    </section>
  );
}
