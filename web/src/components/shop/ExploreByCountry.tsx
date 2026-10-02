"use client";

import Link from "next/link";

import { useMarket } from "@/components/marketplace/MarketProvider";
import { countryGuides } from "@/data/shop";

export default function ExploreByCountry() {
  const { market } = useMarket();

  return (
    <section className="mx-auto w-full max-w-[90rem] px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-forest sm:text-3xl">
            Explore by country
          </h2>
          <p className="mt-1.5 text-forest/65">
            Every country has its own craft. All of these ship to you.
          </p>
        </div>

        <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-forest">
          <span aria-hidden className="h-2 w-2 rounded-full bg-moss" />
          Ships to {market.placeName}
        </span>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {countryGuides.map((guide) => (
          <li key={guide.name}>
            <Link
              href={`/regions?country=${encodeURIComponent(guide.name)}`}
              className="block h-full rounded-2xl bg-white p-4 transition-transform hover:-translate-y-1"
            >
              <span className="block font-semibold text-forest">
                {guide.name}
              </span>
              <span className="mt-1 block text-sm text-forest/60">
                {guide.crafts}
              </span>
              <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.15em] text-clay">
                {guide.creators} creators
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
