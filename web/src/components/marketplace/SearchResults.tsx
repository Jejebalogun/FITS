"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import ActiveFilterChips from "@/components/marketplace/ActiveFilterChips";
import Breadcrumb from "@/components/marketplace/Breadcrumb";
import CreatorResultCard from "@/components/marketplace/CreatorResultCard";
import EmptyPanel, {
  PanelAction,
  PanelBody,
  PanelEyebrow,
  SuggestionChip,
} from "@/components/marketplace/EmptyPanel";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import { searchHref } from "@/components/marketplace/HeaderSearch";
import { useMarket } from "@/components/marketplace/MarketProvider";
import NoMatches from "@/components/marketplace/NoMatches";
import ProductResults, {
  ResultsSkeleton,
} from "@/components/marketplace/ProductResults";
import ResultSummary from "@/components/marketplace/ResultSummary";
import ResultsToolbar from "@/components/marketplace/ResultsToolbar";
import type { Product } from "@/data/marketplace";
import { searchSortOptions } from "@/lib/marketplace-filters";
import {
  alternativesFor,
  correctQuery,
  searchCreators,
  searchProducts,
} from "@/lib/search";
import { useProductResults } from "@/lib/use-product-results";

type Tab = "pieces" | "creators";

const STARTERS = ["adire", "aso-oke", "waist beads", "leather tote"];

type SearchResultsProps = {
  query: string;
  /** Set by "Search instead for …" to switch the spelling correction off. */
  exact: boolean;
};

export default function SearchResults({ query, exact }: SearchResultsProps) {
  const { market, ready } = useMarket();
  const [tab, setTab] = useState<Tab>("pieces");

  // Typo tolerance: only when the words as typed find nothing.
  const { effective, corrected, matched } = useMemo(() => {
    const literal = searchProducts(query);
    const fix = literal.length === 0 && !exact ? correctQuery(query) : null;
    return {
      effective: fix ?? query,
      corrected: fix !== null,
      matched: fix ? searchProducts(fix) : literal,
    };
  }, [query, exact]);

  const results = useProductResults(matched, "relevant");
  const { filters, update } = results;

  const creators = useMemo(
    () =>
      matched.length === 0
        ? []
        : searchCreators(effective, results.visible).filter(
            (creator) =>
              (!filters.verifiedOnly || creator.verified) &&
              (filters.countries.length === 0 ||
                filters.countries.includes(creator.country)),
          ),
    [matched, effective, results.visible, filters],
  );

  const typeFacet = useMemo(() => countTypes(matched), [matched]);

  if (!query) return <StartSearching />;

  const nothing = matched.length === 0;

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="mx-auto w-full max-w-[90rem] px-6 pb-5 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Search", href: "/search" },
            { label: `“${query}”` },
          ]}
        />
      </div>

      <div className="mx-auto flex w-full max-w-[90rem] gap-8 px-6">
        <div className="hidden w-[19rem] shrink-0 lg:block">
          <FilterSidebar
            types={typeFacet}
            filters={filters}
            onChange={update}
            onClear={results.clearAll}
          />
        </div>

        <main className="min-w-0 flex-1">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="break-words font-display text-4xl text-forest">
                {nothing ? `“${query}”` : `Results for “${effective}”`}
              </h1>
              <p className="mt-1.5 text-forest/65" aria-live="polite">
                {!ready ? (
                  "Loading pieces…"
                ) : nothing ? (
                  "0 pieces · 0 creators"
                ) : tab === "creators" ? (
                  `${creators.length} ${
                    creators.length === 1 ? "creator works" : "creators work"
                  } with ${effective}`
                ) : results.visible.length === 0 ? (
                  `0 of ${matched.length} pieces`
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
              options={searchSortOptions}
              onSort={results.setSort}
              layout={results.layout}
              onLayout={results.setLayout}
            />
          </div>

          {corrected && (
            <p className="mt-4 text-forest/75">
              Showing results for{" "}
              <strong className="font-semibold text-forest">{effective}</strong>.
              Search instead for{" "}
              <Link
                href={`${searchHref(query)}&exact=1`}
                className="text-clay underline hover:text-clay-deep"
              >
                {query}
              </Link>
            </p>
          )}

          <Tabs
            tab={tab}
            onTab={setTab}
            pieces={nothing ? 0 : results.visible.length}
            creators={creators.length}
          />

          <ActiveFilterChips filters={filters} onChange={update} />

          {!ready ? (
            <ResultsSkeleton />
          ) : nothing ? (
            <NothingFound query={query} />
          ) : tab === "pieces" ? (
            results.visible.length === 0 ? (
              <NoMatches
                products={matched}
                filters={filters}
                onChange={update}
                onClear={results.clearAll}
              />
            ) : (
              <ProductResults
                products={results.pageItems}
                layout={results.layout}
                page={results.page}
                pageCount={results.pageCount}
                onPage={results.setPage}
              />
            )
          ) : creators.length === 0 ? (
            <EmptyPanel icon="search" title="No creators match these filters">
              <PanelBody>
                The filters on the left apply to creators too. Clear them to see
                everyone who works with {effective}.
              </PanelBody>
              <div className="mt-7">
                <PanelAction onClick={results.clearAll}>Clear all filters</PanelAction>
              </div>
            </EmptyPanel>
          ) : (
            <ul className="mt-7 space-y-5">
              {creators.map((creator) => (
                <li key={creator.slug}>
                  <CreatorResultCard creator={creator} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}

/** The type facet for a search: whatever types the matches fall into. */
function countTypes(products: Product[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.type, (counts.get(product.type) ?? 0) + 1);
  }
  return Array.from(counts, ([label, count]) => ({ label, count })).sort(
    (a, b) => b.count - a.count,
  );
}

function Tabs({
  tab,
  onTab,
  pieces,
  creators,
}: {
  tab: Tab;
  onTab: (tab: Tab) => void;
  pieces: number;
  creators: number;
}) {
  const items: { key: Tab; label: string; count: number }[] = [
    { key: "pieces", label: "Pieces", count: pieces },
    { key: "creators", label: "Creators", count: creators },
  ];

  return (
    <div role="tablist" className="mt-6 flex gap-8 border-b border-forest/15">
      {items.map((item) => {
        const active = item.key === tab;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTab(item.key)}
            className={`-mb-px flex items-center gap-2.5 border-b-2 pb-3 text-lg font-semibold transition-colors ${
              active
                ? "border-clay text-forest"
                : "border-transparent text-forest/45 hover:text-forest/70"
            }`}
          >
            {item.label}
            <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-forest/70">
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Nobody has listed anything matching, filters aside. */
function NothingFound({ query }: { query: string }) {
  const { best, terms, category } = alternativesFor(query);

  return (
    <EmptyPanel icon="search" title={`Nothing for “${query}” yet`}>
      <PanelBody>
        No creator has listed this yet. Try a broader word, check the spelling, or
        browse the craft it belongs to.
      </PanelBody>

      {terms.length > 0 && (
        <>
          <PanelEyebrow>Try instead</PanelEyebrow>
          <ul className="mt-3 flex flex-wrap justify-center gap-2.5 sm:justify-start">
            {terms.map((term) => (
              <SuggestionChip key={term} href={searchHref(term)}>
                {term}
              </SuggestionChip>
            ))}
          </ul>
        </>
      )}

      <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
        {best && <PanelAction href={searchHref(best)}>Search “{best}”</PanelAction>}
        <PanelAction
          variant={best ? "secondary" : "primary"}
          href={`/category/${category.slug}`}
        >
          Browse all of {category.name}
        </PanelAction>
      </div>
    </EmptyPanel>
  );
}

/** /search with nothing typed. */
function StartSearching() {
  return (
    <div className="min-h-screen bg-cream pb-20">
      <main className="mx-auto w-full max-w-[90rem] px-6 pt-10">
        <h1 className="font-display text-4xl text-forest">Search</h1>
        <EmptyPanel icon="search" title="What are you looking for?">
          <PanelBody>
            Search by piece, craft, creator or country — &ldquo;adire&rdquo;,
            &ldquo;Kumasi&rdquo; and &ldquo;Fatima Bello&rdquo; all work.
          </PanelBody>
          <PanelEyebrow>Popular this week</PanelEyebrow>
          <ul className="mt-3 flex flex-wrap justify-center gap-2.5 sm:justify-start">
            {STARTERS.map((term) => (
              <SuggestionChip key={term} href={searchHref(term)}>
                {term}
              </SuggestionChip>
            ))}
          </ul>
        </EmptyPanel>
      </main>
    </div>
  );
}
