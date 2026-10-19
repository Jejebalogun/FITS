"use client";

import { useMarket } from "@/components/marketplace/MarketProvider";
import { filterParts, type Filters } from "@/lib/marketplace-filters";

/** One removable chip per active filter, above the results. */
export default function ActiveFilterChips({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const { market } = useMarket();
  const parts = filterParts(filters, market);
  if (parts.length === 0) return null;

  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {parts.map((part) => (
        <li key={part.key}>
          <button
            type="button"
            onClick={() => onChange(part.without)}
            className="flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm text-cream transition-colors hover:bg-forest-deep"
          >
            {part.label}
            <span aria-hidden className="text-cream/70">
              ✕
            </span>
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
