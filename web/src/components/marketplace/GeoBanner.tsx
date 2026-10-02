"use client";

import { useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";

/**
 * Confirms the country we guessed before the visitor reads a single price.
 * Getting this wrong means every price and delivery estimate on the page is
 * wrong, so it asks rather than assumes.
 */
export default function GeoBanner({
  onChangeCountry,
}: {
  onChangeCountry?: () => void;
}) {
  const { market, detected, confirmDetected } = useMarket();
  const [dismissed, setDismissed] = useState(false);

  if (!detected || dismissed) return null;

  return (
    <div className="bg-sand">
      <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3 text-sm text-forest">
        <span aria-hidden>{market.flag}</span>
        <p className="flex-1">
          Looks like you&rsquo;re in the{" "}
          <strong className="font-semibold">{market.country}</strong> — we&rsquo;ll
          show prices in {market.moneyName} and {market.placeName} delivery times.
        </p>

        <button
          type="button"
          onClick={confirmDetected}
          className="rounded-full bg-forest-deep px-4 py-1.5 text-sm font-semibold text-cream transition-colors hover:bg-forest"
        >
          That&rsquo;s right
        </button>
        <button
          type="button"
          onClick={onChangeCountry}
          className="text-sm font-medium text-clay underline hover:text-clay-deep"
        >
          Change country
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-forest/50 transition-colors hover:text-forest"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
