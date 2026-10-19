"use client";

import EmptyPanel, {
  PanelAction,
  PanelBody,
  PanelEyebrow,
  SuggestionChip,
} from "@/components/marketplace/EmptyPanel";
import { useMarket } from "@/components/marketplace/MarketProvider";
import type { Product } from "@/data/marketplace";
import {
  applyFilters,
  countActiveFilters,
  filterParts,
  type Filters,
} from "@/lib/marketplace-filters";

const RELAXATIONS_SHOWN = 3;

type NoMatchesProps = {
  /** Everything in scope before filtering, to count what each removal brings back. */
  products: Product[];
  filters: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
  /** Leaves the narrowed scope entirely: "Browse all of Fashion". */
  browse?: { label: string; onClick: () => void };
};

/**
 * Filters that rule everything out. Rather than only offering a reset, it
 * names the culprits and shows what removing each one would bring back.
 */
export default function NoMatches({
  products,
  filters,
  onChange,
  onClear,
  browse,
}: NoMatchesProps) {
  const { market } = useMarket();
  const count = countActiveFilters(filters);

  // A single chosen type is the page's scope (it is in the heading), so it is
  // left out of the suggestions and handled by `browse` instead.
  const scopedByType = filters.types.length === 1 && Boolean(browse);

  const relaxations = filterParts(filters, market)
    .filter((part) => !(scopedByType && part.kind === "type"))
    .map((part) => ({
      part,
      gain: applyFilters(products, part.without, market).length,
    }))
    .filter((item) => item.gain > 0)
    .sort((a, b) => b.gain - a.gain);

  const culprits = relaxations.map((item) => item.part);
  const shown = relaxations.slice(0, RELAXATIONS_SHOWN);

  return (
    <EmptyPanel
      icon="search"
      title={
        count === 1
          ? "No pieces match that filter"
          : `No pieces match all ${count} filters`
      }
    >
      <PanelBody>
        {explain(culprits.map((part) => part.noun))}
        {culprits.some((part) => part.key === "within") &&
          ` ${deliveryNote(products, market.placeName)}`}
      </PanelBody>

      {shown.length > 0 && (
        <>
          <PanelEyebrow>Remove one to see more</PanelEyebrow>
          <ul className="mt-3 flex flex-wrap justify-center gap-2.5 sm:justify-start">
            {shown.map(({ part, gain }) => (
              <SuggestionChip key={part.key} onClick={() => onChange(part.without)}>
                {part.label} — {gain} more
              </SuggestionChip>
            ))}
          </ul>
        </>
      )}

      <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
        <PanelAction onClick={onClear}>Clear all filters</PanelAction>
        {browse && (
          <PanelAction variant="secondary" onClick={browse.onClick}>
            {browse.label}
          </PanelAction>
        )}
      </div>
    </EmptyPanel>
  );
}

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Names the filters whose removal alone would bring pieces back. */
function explain(nouns: string[]) {
  if (nouns.length === 0) {
    return "No single filter is to blame — it takes removing two or more to see pieces.";
  }
  if (nouns.length === 1) {
    return `${capitalise(nouns[0])} is what rules everything out.`;
  }
  const list = `${nouns.slice(0, -1).join(", ")} and ${nouns[nouns.length - 1]}`;
  return `${capitalise(list)} together rule everything out.`;
}

/** "Most pieces here are made to order and take 12 to 21 days to reach the UK." */
function deliveryNote(products: Product[], placeName: string) {
  const made = products.filter((product) => product.delivery);
  if (made.length === 0) return "";

  const fastest = Math.min(...made.map((product) => product.delivery!.minDays));
  const slowest = Math.max(...made.map((product) => product.delivery!.maxDays));
  const lead =
    made.length * 2 > products.length
      ? "Most pieces here are made to order and take"
      : "Made-to-order pieces here take";

  return `${lead} ${fastest} to ${slowest} days to reach ${placeName}.`;
}
