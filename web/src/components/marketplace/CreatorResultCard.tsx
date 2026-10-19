"use client";

import Link from "next/link";

import { useShopper } from "@/components/marketplace/ShopperProvider";
import { productsByCreator, type Creator } from "@/data/marketplace";

/** 3200 → "3.2k", 920 → "920" */
export function formatFollowers(count: number) {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
}

export default function CreatorResultCard({ creator }: { creator: Creator }) {
  const { isFollowing, toggleFollow } = useShopper();
  const following = isFollowing(creator.slug);
  const pieces = productsByCreator(creator.name).slice(0, 3);
  const shopHref = `/creator/${creator.slug}`;

  return (
    <article className="flex flex-col gap-5 rounded-3xl bg-white p-6 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-5 sm:max-w-sm">
        <span
          aria-hidden
          className={`h-20 w-20 shrink-0 rounded-full ${creator.tone}`}
        />
        <div className="min-w-0">
          <h3 className="font-display text-xl text-forest">
            <Link href={shopHref} className="hover:text-clay">
              {creator.name}
            </Link>
            {creator.verified && (
              <span className="text-moss" title="Verified creator">
                {" "}
                ✓
              </span>
            )}
          </h3>
          <p className="mt-1 text-forest/65">
            {creator.craft} · {creator.city}, {creator.country}
          </p>
          <p className="mt-1.5 text-sm text-forest/70">
            {creator.reviews > 0 ? (
              <>
                <span aria-hidden className="text-clay">
                  ★
                </span>{" "}
                {creator.rating.toFixed(1)}
              </>
            ) : (
              "New shop"
            )}{" "}
            · {creator.pieceCount} pieces ·{" "}
            {formatFollowers(creator.followers)} followers
          </p>
        </div>
      </div>

      {pieces.length > 0 && (
        <ul className="hidden flex-1 grid-cols-3 gap-3 md:grid">
          {pieces.map((product) => (
            <li key={product.id}>
              <Link
                href={`/product/${product.id}`}
                aria-label={product.name}
                className={`block aspect-[16/10] rounded-xl ${product.tone} transition-opacity hover:opacity-90`}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="flex shrink-0 items-center gap-4 sm:w-44 sm:flex-col sm:gap-3">
        <button
          type="button"
          onClick={() => toggleFollow(creator.slug)}
          aria-pressed={following}
          className={`w-full rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${
            following
              ? "border-forest bg-forest text-cream hover:bg-forest-deep"
              : "border-forest text-forest hover:bg-forest/5"
          }`}
        >
          {following ? "Following" : "Follow"}
          <span className="sr-only"> {creator.name}</span>
        </button>
        <Link
          href={shopHref}
          className="whitespace-nowrap text-sm font-medium text-clay hover:text-clay-deep"
        >
          Visit shop →
        </Link>
      </div>
    </article>
  );
}
