"use client";

import Link from "next/link";

import DeliveryBadge from "@/components/marketplace/DeliveryBadge";
import { useMarket } from "@/components/marketplace/MarketProvider";
import SaveButton from "@/components/marketplace/SaveButton";
import { formatMoney } from "@/data/markets";
import type { Product } from "@/data/marketplace";

type CardProps = {
  product: Product;
  layout?: "grid" | "list";
};

export default function MarketplaceProductCard({
  product,
  layout = "grid",
}: CardProps) {
  const { market } = useMarket();
  const list = layout === "list";

  return (
    <article className={list ? "flex gap-5" : undefined}>
      <div
        className={`relative overflow-hidden rounded-2xl ${product.tone} ${
          list ? "h-40 w-40 shrink-0" : "aspect-[4/5]"
        }`}
      >
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0"
          aria-label={product.name}
        />

        <SaveButton product={product} />

        <DeliveryBadge product={product} className="absolute bottom-3 left-3" />
      </div>

      <div className={list ? "flex-1 pt-1" : "pt-3"}>
        <h3 className="font-semibold text-forest">
          <Link href={`/product/${product.id}`} className="hover:text-clay">
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

        <div className="mt-2 flex items-baseline justify-between gap-3">
          <p className="font-semibold text-forest">
            {formatMoney(product.priceGBP, market)}
          </p>
          {product.reviews > 0 ? (
            <p className="text-sm text-forest/60">
              <span aria-hidden className="text-clay">
                ★
              </span>{" "}
              {product.rating.toFixed(1)} ({product.reviews})
            </p>
          ) : (
            <p className="text-sm text-forest/60">New</p>
          )}
        </div>
      </div>
    </article>
  );
}
