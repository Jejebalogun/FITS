"use client";

import Link from "next/link";

import DeliveryBadge from "@/components/marketplace/DeliveryBadge";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { formatMoney } from "@/data/markets";
import type { Product } from "@/data/marketplace";

type CardProps = {
  product: Product;
  saved: boolean;
  onToggleSave: (id: string) => void;
  layout?: "grid" | "list";
};

export default function MarketplaceProductCard({
  product,
  saved,
  onToggleSave,
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

        <button
          type="button"
          onClick={() => onToggleSave(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/95 text-lg transition-transform hover:scale-105"
        >
          <span className={saved ? "text-clay" : "text-forest/40"}>
            {saved ? "♥" : "♡"}
          </span>
        </button>

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
          <p className="text-sm text-forest/60">
            <span aria-hidden className="text-clay">
              ★
            </span>{" "}
            {product.rating.toFixed(1)} ({product.reviews})
          </p>
        </div>
      </div>
    </article>
  );
}
