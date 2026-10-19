"use client";

import { useShopper } from "@/components/marketplace/ShopperProvider";
import type { Product } from "@/data/marketplace";

/** The heart on a piece. Saved pieces are shared across every page. */
export default function SaveButton({
  product,
  className = "absolute right-3 top-3 h-9 w-9 bg-cream/95 text-lg",
}: {
  product: Product;
  className?: string;
}) {
  const { isSaved, toggleSaved } = useShopper();
  const saved = isSaved(product.id);

  return (
    <button
      type="button"
      onClick={() => toggleSaved(product.id)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
      className={`flex items-center justify-center rounded-full transition-transform hover:scale-105 ${className}`}
    >
      <span aria-hidden className={saved ? "text-clay" : "text-forest/40"}>
        {saved ? "♥" : "♡"}
      </span>
    </button>
  );
}
