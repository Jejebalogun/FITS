"use client";

import { useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";
import { convert, formatAmount } from "@/data/markets";
import { countryFacets, type Country } from "@/data/marketplace";
import {
  PRICE_MAX_GBP,
  countActiveFilters,
  type Filters,
} from "@/lib/marketplace-filters";

const TYPES_SHOWN = 5;
const DELIVERY_WINDOWS = [10, 14, 21];

type FilterSidebarProps = {
  /** The type facet, with counts. A category passes its own; search derives one. */
  types: { label: string; count: number }[];
  filters: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
};

export default function FilterSidebar({
  types,
  filters,
  onChange,
  onClear,
}: FilterSidebarProps) {
  const { market } = useMarket();
  const [typesOpen, setTypesOpen] = useState(true);
  const [showAllTypes, setShowAllTypes] = useState(false);

  const activeCount = countActiveFilters(filters);
  const visibleTypes = showAllTypes ? types : types.slice(0, TYPES_SHOWN);
  const hiddenTypeCount = types.length - TYPES_SHOWN;

  function toggleType(label: string) {
    const types = filters.types.includes(label)
      ? filters.types.filter((type) => type !== label)
      : [...filters.types, label];
    onChange({ ...filters, types });
  }

  function toggleCountry(country: Country) {
    const countries = filters.countries.includes(country)
      ? filters.countries.filter((item) => item !== country)
      : [...filters.countries, country];
    onChange({ ...filters, countries });
  }

  return (
    <aside className="rounded-3xl bg-white p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl text-forest">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-clay hover:text-clay-deep"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Type */}
      {types.length > 0 && (
        <section className="mt-6">
          <button
            type="button"
            onClick={() => setTypesOpen((v) => !v)}
            aria-expanded={typesOpen}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold text-forest">Type</h3>
            <span aria-hidden className="text-forest/50">
              {typesOpen ? "−" : "+"}
            </span>
          </button>

          {typesOpen && (
            <>
              <ul className="mt-3 space-y-2.5">
                {visibleTypes.map((type) => (
                  <li key={type.label}>
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-forest/85">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type.label)}
                        onChange={() => toggleType(type.label)}
                        className="h-4 w-4 shrink-0 accent-forest"
                      />
                      <span className="flex-1">{type.label}</span>
                      <span className="text-forest/45">{type.count}</span>
                    </label>
                  </li>
                ))}
              </ul>

              {hiddenTypeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllTypes((v) => !v)}
                  className="mt-3 text-sm font-medium text-clay hover:text-clay-deep"
                >
                  {showAllTypes ? "Show fewer" : `+ ${hiddenTypeCount} more`}
                </button>
              )}
            </>
          )}
        </section>
      )}

      <Divider />

      {/* Price */}
      <section>
        <h3 className="font-semibold text-forest">Price</h3>
        <PriceRange filters={filters} onChange={onChange} />
        <div className="mt-3 flex items-center gap-3">
          <PriceBox
            label="Minimum price"
            value={formatAmount(convert(filters.minGBP, market), market)}
          />
          <span aria-hidden className="text-forest/40">
            –
          </span>
          <PriceBox
            label="Maximum price"
            value={`${formatAmount(convert(filters.maxGBP, market), market)}${
              filters.maxGBP >= PRICE_MAX_GBP ? "+" : ""
            }`}
          />
        </div>
      </section>

      <Divider />

      {/* Delivery window — labelled with the market, as the designs show. */}
      <section>
        <h3 className="font-semibold text-forest">
          Arrives in {market.placeName} within
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {DELIVERY_WINDOWS.map((days) => (
            <Pill
              key={days}
              selected={filters.withinDays === days}
              onClick={() =>
                onChange({
                  ...filters,
                  withinDays: filters.withinDays === days ? null : days,
                })
              }
            >
              {days} days
            </Pill>
          ))}
          <Pill
            selected={filters.withinDays === null}
            onClick={() => onChange({ ...filters, withinDays: null })}
          >
            Any
          </Pill>
        </div>
      </section>

      <Divider />

      {/* Made in */}
      <section>
        <h3 className="font-semibold text-forest">Made in</h3>
        <ul className="mt-3 space-y-2.5">
          {countryFacets.map((facet) => (
            <li key={facet.country}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-forest/85">
                <input
                  type="checkbox"
                  checked={filters.countries.includes(facet.country)}
                  onChange={() => toggleCountry(facet.country)}
                  className="h-4 w-4 shrink-0 accent-forest"
                />
                <span className="flex-1">{facet.country}</span>
                <span className="text-forest/45">{facet.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      {/* Switches */}
      <section className="space-y-3">
        <Switch
          label="Verified creators only"
          checked={filters.verifiedOnly}
          onChange={(verifiedOnly) => onChange({ ...filters, verifiedOnly })}
        />
        <Switch
          label={`Ships to ${market.placeName}`}
          checked={filters.shipsToMarket}
          onChange={(shipsToMarket) => onChange({ ...filters, shipsToMarket })}
        />
        <Switch
          label="Takes custom sizes"
          checked={filters.customSizes}
          onChange={(customSizes) => onChange({ ...filters, customSizes })}
        />
      </section>

      <Divider />

      {/* Rating */}
      <section>
        <h3 className="font-semibold text-forest">Rating</h3>
        <ul className="mt-3 space-y-2.5">
          {[4, 3].map((stars) => (
            <li key={stars}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-forest/85">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === stars}
                  onChange={() => onChange({ ...filters, minRating: stars })}
                  className="h-4 w-4 shrink-0 accent-forest"
                />
                <span aria-hidden className="text-clay">
                  {"★".repeat(stars)}
                </span>
                <span>&amp; up</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function Divider() {
  return <div className="my-6 h-px bg-forest/10" />;
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        selected
          ? "border-forest bg-forest text-cream"
          : "border-forest/20 text-forest hover:border-forest/50"
      }`}
    >
      {children}
    </button>
  );
}

function PriceBox({ label, value }: { label: string; value: string }) {
  return (
    <output
      aria-label={label}
      className="flex-1 rounded-xl border border-forest/15 px-3 py-2.5 text-sm text-forest"
    >
      {value}
    </output>
  );
}

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-forest/85">{label}</span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-forest/15 transition-colors peer-checked:bg-moss peer-focus-visible:ring-2 peer-focus-visible:ring-forest peer-focus-visible:ring-offset-2" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

/**
 * Two overlaid range inputs. Each handle keeps to its own side so they cannot
 * cross, and the filled portion between them is drawn underneath.
 */
function PriceRange({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const left = (filters.minGBP / PRICE_MAX_GBP) * 100;
  const right = (filters.maxGBP / PRICE_MAX_GBP) * 100;

  return (
    <div className="relative mt-4 h-5">
      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-forest/15" />
      <span
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-forest"
        style={{ left: `${left}%`, right: `${100 - right}%` }}
      />

      <input
        type="range"
        aria-label="Minimum price"
        min={0}
        max={PRICE_MAX_GBP}
        step={1}
        value={filters.minGBP}
        onChange={(event) =>
          onChange({
            ...filters,
            minGBP: Math.min(Number(event.target.value), filters.maxGBP - 1),
          })
        }
        className="price-thumb absolute inset-0 w-full"
      />
      <input
        type="range"
        aria-label="Maximum price"
        min={0}
        max={PRICE_MAX_GBP}
        step={1}
        value={filters.maxGBP}
        onChange={(event) =>
          onChange({
            ...filters,
            maxGBP: Math.max(Number(event.target.value), filters.minGBP + 1),
          })
        }
        className="price-thumb absolute inset-0 w-full"
      />
    </div>
  );
}
