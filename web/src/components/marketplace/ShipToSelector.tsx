"use client";

import { useCallback, useRef } from "react";

import { markets, type MarketCode } from "@/data/markets";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { useDismiss } from "@/lib/use-dismiss";

export default function ShipToSelector() {
  const {
    market,
    setMarket,
    detected,
    pickerOpen: open,
    setPickerOpen: setOpen,
  } = useMarket();
  const wrapper = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);
  useDismiss(wrapper, open, close);

  function choose(code: MarketCode) {
    setMarket(code);
    setOpen(false);
  }

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        // Highlighted while the country is still a guess, so it invites a check.
        className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors ${
          detected
            ? "border-clay bg-clay/10 text-cream"
            : "border-cream/25 text-cream hover:border-cream/50"
        }`}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/55">
          Ship to
        </span>
        <span aria-hidden>{market.flag}</span>
        <span className="font-medium">
          {market.country} · {market.symbol}
        </span>
        <span aria-hidden className="text-cream/60">
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Ship to country"
          className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl bg-white py-2 shadow-lg"
        >
          {markets.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={option.code === market.code}
                onClick={() => choose(option.code)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-sand ${
                  option.code === market.code
                    ? "font-semibold text-forest"
                    : "text-forest/80"
                }`}
              >
                <span aria-hidden>{option.flag}</span>
                <span className="flex-1">{option.country}</span>
                <span className="text-forest/50">
                  {option.symbol} {option.currency}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
