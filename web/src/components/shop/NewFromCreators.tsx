"use client";

import Link from "next/link";

import SectionHeader from "@/components/shop/SectionHeader";
import DeliveryBadge from "@/components/marketplace/DeliveryBadge";
import SaveButton from "@/components/marketplace/SaveButton";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { newFromCreators } from "@/data/shop";
import { formatMoney } from "@/data/markets";
import { products } from "@/data/marketplace";

export default function NewFromCreators() {
  const { market } = useMarket();

  const picks = newFromCreators
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> =>
      Boolean(product),
    );

  const verifiedCount = products.filter((product) => product.verified).length;

  return (
    <section className="mx-auto w-full max-w-[90rem] px-6 py-14">
      <SectionHeader
        title="New from verified creators"
        action={{
          label: `See all ${verifiedCount}`,
          href: "/category/new-in",
        }}
      />

      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((product) => {
          return (
            <li key={product.id}>
              <article>
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${product.tone}`}
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="absolute inset-0"
                    aria-label={product.name}
                  />
                  <SaveButton product={product} />

                  <DeliveryBadge
                    product={product}
                    mode="made"
                    className="absolute bottom-3 left-3"
                  />
                </div>

                <h3 className="mt-3 font-semibold text-forest">
                  <Link
                    href={`/product/${product.id}`}
                    className="hover:text-clay"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-0.5 text-sm text-forest/60">
                  {product.creator} · {product.country}
                  {product.verified && (
                    <span className="text-moss" title="Verified creator">
                      {" "}
                      ✓
                    </span>
                  )}
                </p>
                <p className="mt-2 font-semibold text-forest">
                  {formatMoney(product.priceGBP, market)}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
