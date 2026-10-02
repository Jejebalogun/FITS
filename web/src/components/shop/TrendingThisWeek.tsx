"use client";

import Link from "next/link";

import SectionHeader from "@/components/shop/SectionHeader";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { trending } from "@/data/shop";
import { formatMoney } from "@/data/markets";
import { products } from "@/data/marketplace";

export default function TrendingThisWeek() {
  const { market } = useMarket();

  const rows = trending
    .map((entry) => {
      const product = products.find((item) => item.id === entry.productId);
      return product ? { ...entry, product } : null;
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <section className="mx-auto w-full max-w-[90rem] px-6 py-14">
      <SectionHeader
        title="Trending this week"
        sub={`Most saved and ordered by buyers in ${market.placeName}.`}
        action={{ label: "See the top 50", href: "/category/new-in" }}
      />

      <ol className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {rows.map((row, index) => (
          <li key={row.productId}>
            <Link
              href={`/product/${row.productId}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 transition-transform hover:-translate-y-0.5"
            >
              <span
                aria-hidden
                className="w-6 shrink-0 text-center font-display text-2xl text-clay"
              >
                {index + 1}
              </span>

              <span
                aria-hidden
                className={`h-14 w-14 shrink-0 rounded-xl ${row.product.tone}`}
              />

              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-forest">
                  {row.product.name}
                </span>
                <span className="block truncate text-sm text-forest/60">
                  {row.product.creator} · {row.product.country}
                  {row.product.verified && (
                    <span className="text-moss" title="Verified creator">
                      {" "}
                      ✓
                    </span>
                  )}
                </span>
                <span className="mt-1 flex items-baseline gap-2">
                  <span className="font-semibold text-forest">
                    {formatMoney(row.product.priceGBP, market)}
                  </span>
                  <span className="text-xs text-clay">
                    {row.metric === "saves" ? (
                      <>
                        <span aria-hidden>↑</span> {row.count} saves
                      </>
                    ) : (
                      <>{row.count} ordered</>
                    )}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
