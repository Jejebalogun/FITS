"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import FilterSidebar from "@/components/marketplace/FilterSidebar";
import GeoBanner from "@/components/marketplace/GeoBanner";
import MarketplaceProductCard from "@/components/marketplace/MarketplaceProductCard";
import { useMarket } from "@/components/marketplace/MarketProvider";
import Pagination from "@/components/marketplace/Pagination";
import { convert, formatAmount } from "@/data/markets";
import type { Category, Product } from "@/data/marketplace";
import {
  PRICE_MAX_GBP,
  applyFilters,
  countActiveFilters,
  emptyFilters,
  sortOptions,
  sortProducts,
  type Filters,
  type SortKey,
} from "@/lib/marketplace-filters";

const PER_PAGE = 9;

type CategoryBrowserProps = {
  category: Category;
  products: Product[];
};

export default function CategoryBrowser({
  category,
  products,
}: CategoryBrowserProps) {
  const { market } = useMarket();

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const filtered = applyFilters(products, filters, market);
    return sortProducts(filtered, sort);
  }, [products, filters, market, sort]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PER_PAGE));

  // A narrowed result set can leave the current page out of range.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const pageItems = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = countActiveFilters(filters);

  // When exactly one type is chosen the page takes its name, as the designs show.
  const heading = filters.types.length === 1 ? filters.types[0] : category.name;

  function update(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  function clearAll() {
    setFilters(emptyFilters);
    setPage(1);
  }

  function toggleSave(id: string) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <>
      <GeoBanner
        onChangeCountry={() =>
          searchRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* Breadcrumb */}
      <div className="bg-cream">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto w-full max-w-[90rem] px-6 py-3 text-sm text-forest/60"
        >
          <Link href="/" className="hover:text-forest">
            Home
          </Link>
          <span aria-hidden className="px-2">
            /
          </span>
          {filters.types.length === 1 ? (
            <>
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-forest"
              >
                {category.name}
              </Link>
              <span aria-hidden className="px-2">
                /
              </span>
              <span className="text-forest">{heading}</span>
            </>
          ) : (
            <span className="text-forest">{category.name}</span>
          )}
        </nav>
      </div>

      <div className="min-h-screen bg-cream pb-20">
        <div className="mx-auto flex w-full max-w-[90rem] gap-8 px-6 pt-4">
          <div className="hidden w-[19rem] shrink-0 lg:block">
            <FilterSidebar
              category={category}
              filters={filters}
              onChange={update}
              onClear={clearAll}
            />
          </div>

          <main className="min-w-0 flex-1" ref={searchRef}>
            {/* Title row */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl text-forest">{heading}</h1>
                <p className="mt-1.5 text-forest/65">
                  <ResultSummary
                    products={visible}
                    filters={filters}
                    placeName={market.placeName}
                  />
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-forest/70">
                  Sort by
                  <select
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value as SortKey);
                      setPage(1);
                    }}
                    className="rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm font-medium text-forest outline-none focus:border-forest"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex overflow-hidden rounded-xl border border-forest/15">
                  <LayoutButton
                    active={layout === "grid"}
                    onClick={() => setLayout("grid")}
                    label="Grid view"
                  >
                    ▦
                  </LayoutButton>
                  <LayoutButton
                    active={layout === "list"}
                    onClick={() => setLayout("list")}
                    label="List view"
                  >
                    ☰
                  </LayoutButton>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {filters.types.map((type) => (
                  <Chip
                    key={type}
                    onRemove={() =>
                      update({
                        ...filters,
                        types: filters.types.filter((item) => item !== type),
                      })
                    }
                  >
                    {type}
                  </Chip>
                ))}

                {(filters.minGBP > 0 || filters.maxGBP < PRICE_MAX_GBP) && (
                  <Chip
                    onRemove={() =>
                      update({ ...filters, minGBP: 0, maxGBP: PRICE_MAX_GBP })
                    }
                  >
                    {formatAmount(convert(filters.minGBP, market), market)} –{" "}
                    {formatAmount(convert(filters.maxGBP, market), market)}
                    {filters.maxGBP >= PRICE_MAX_GBP ? "+" : ""}
                  </Chip>
                )}

                {filters.withinDays !== null && (
                  <Chip onRemove={() => update({ ...filters, withinDays: null })}>
                    Arrives within {filters.withinDays} days
                  </Chip>
                )}

                {filters.countries.map((country) => (
                  <Chip
                    key={country}
                    onRemove={() =>
                      update({
                        ...filters,
                        countries: filters.countries.filter(
                          (item) => item !== country,
                        ),
                      })
                    }
                  >
                    {country}
                  </Chip>
                ))}

                {filters.verifiedOnly && (
                  <Chip
                    onRemove={() => update({ ...filters, verifiedOnly: false })}
                  >
                    Verified only
                  </Chip>
                )}
                {filters.shipsToMarket && (
                  <Chip
                    onRemove={() => update({ ...filters, shipsToMarket: false })}
                  >
                    Ships to {market.placeName}
                  </Chip>
                )}
                {filters.customSizes && (
                  <Chip
                    onRemove={() => update({ ...filters, customSizes: false })}
                  >
                    Takes custom sizes
                  </Chip>
                )}
                {filters.minRating !== null && (
                  <Chip onRemove={() => update({ ...filters, minRating: null })}>
                    {filters.minRating} stars &amp; up
                  </Chip>
                )}
              </ul>
            )}

            {/* All-in pricing promise */}
            <section className="mt-6 overflow-hidden rounded-3xl bg-forest-deep">
              <div className="flex items-center">
                <div className="flex-1 p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-clay">
                    Your prices
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-cream">
                    Shipping to {market.placeName}, all in
                  </h2>
                  <p className="mt-2 text-cream/75">
                    Prices in {market.moneyName}, delivery and duties shown before
                    you pay. Money held until it arrives.
                  </p>
                </div>
                <div
                  aria-hidden
                  className="hidden h-44 w-72 shrink-0 bg-clay-soft/30 md:block"
                />
              </div>
            </section>

            {/* Results */}
            {pageItems.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div
                className={
                  layout === "grid"
                    ? "mt-7 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-3"
                    : "mt-7 flex flex-col gap-6"
                }
              >
                {pageItems.map((product) => (
                  <MarketplaceProductCard
                    key={product.id}
                    product={product}
                    layout={layout}
                    saved={saved.includes(product.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            )}

            <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          </main>
        </div>
      </div>
    </>
  );
}

/** "84 pieces from 31 verified creators · all ship to the UK" */
function ResultSummary({
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

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm text-cream transition-colors hover:bg-forest-deep"
      >
        {children}
        <span aria-hidden className="text-cream/70">
          ✕
        </span>
        <span className="sr-only">Remove filter</span>
      </button>
    </li>
  );
}

function LayoutButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`px-3.5 py-2.5 transition-colors ${
        active ? "bg-forest text-cream" : "bg-white text-forest/60 hover:text-forest"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-7 rounded-3xl bg-white px-6 py-16 text-center">
      <h2 className="font-display text-2xl text-forest">
        Nothing matches all of that
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-forest/65">
        Try widening the price range or the delivery window — makers further away
        often take a few days longer.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-full bg-clay px-6 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep"
      >
        Clear all filters
      </button>
    </div>
  );
}
