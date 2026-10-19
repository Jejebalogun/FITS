"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";
import SaveToList from "@/components/marketplace/SaveToList";
import { formatMoney, type Market } from "@/data/markets";
import { formatPostAge, type FeedPost } from "@/data/feed";
import type { Creator, Product } from "@/data/marketplace";
import { blockerFor } from "@/lib/cart";
import { arrivalWindow, formatDateWindow } from "@/lib/delivery";
import { useDismiss } from "@/lib/use-dismiss";

export type PostAction = "hide" | "fewer" | "unfollow" | "report";

type PostCardProps = {
  post: FeedPost;
  creator: Creator;
  product: Product;
  today: Date | null;
  onAction: (action: PostAction) => void;
};

export default function PostCard({
  post,
  creator,
  product,
  today,
  onAction,
}: PostCardProps) {
  const { market } = useMarket();

  return (
    <article className="rounded-3xl bg-white p-5 sm:p-6">
      <header className="flex items-start gap-3">
        <span aria-hidden className={`h-10 w-10 shrink-0 rounded-full ${creator.tone}`} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/creator/${creator.slug}`}
            className="font-semibold text-forest hover:text-clay"
          >
            {creator.name}
            {creator.verified && <span className="text-moss"> ✓</span>}
          </Link>
          <p className="text-sm text-forest/55">
            {creator.city}, {creator.country} · {formatPostAge(post.hoursAgo)}
          </p>
        </div>
        <span
          className={`mt-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            post.kind === "new-piece" ? "bg-sage text-forest" : "bg-clay-wash text-clay-deep"
          }`}
        >
          {post.kind === "new-piece" ? "New piece" : "Making of"}
        </span>
        <PostMenu creator={creator} kind={post.kind} onAction={onAction} />
      </header>

      <p className="mt-4 text-forest/85">{post.caption}</p>

      <Link
        href={`/product/${product.id}`}
        aria-label={product.name}
        className="mt-4 grid h-56 grid-cols-[1.4fr_1fr] gap-2.5 sm:h-60"
      >
        <span className={`rounded-2xl ${product.tone}`} />
        <span className={`rounded-2xl ${post.secondTone ?? creator.tone}`} />
      </Link>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-forest">{product.name}</p>
          <p className="text-sm text-forest/60">{availability(product, creator, market, today)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-xl text-forest">
            {formatMoney(product.priceGBP, market)}
          </span>
          <SaveToList product={product} />
          <Link
            href={`/product/${product.id}`}
            className="rounded-full bg-clay px-5 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            View piece
          </Link>
        </div>
      </footer>
    </article>
  );
}

/** "Ready to ship · arrives in the UK 10–13 Oct" */
function availability(
  product: Product,
  creator: Creator,
  market: Market,
  today: Date | null,
) {
  const blocker = blockerFor(product, market);
  if (blocker === "sold-out") return "Sold out";
  if (blocker === "not-open") return "Not yet orderable · opens soon";
  if (blocker === "no-delivery") return `Doesn’t ship to ${market.placeName} yet`;

  const kind = product.delivery ? "Made to order" : "Ready to ship";
  if (!today) return kind;
  return `${kind} · arrives in ${market.placeName} ${formatDateWindow(
    arrivalWindow(product, creator),
    today,
  )}`;
}

function PostMenu({
  creator,
  kind,
  onAction,
}: {
  creator: Creator;
  kind: FeedPost["kind"];
  onAction: (action: PostAction) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(wrapper, open, close);

  function pick(action: PostAction) {
    setOpen(false);
    onAction(action);
  }

  const item =
    "block w-full rounded-xl px-3 py-2.5 text-left text-sm text-forest transition-colors hover:bg-sand/60";

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`More options for this post from ${creator.name}`}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-forest/60 transition-colors hover:bg-sand/60 ${
          open ? "bg-sand/60" : ""
        }`}
      >
        <span aria-hidden>···</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border border-forest/10 bg-cream p-2 shadow-xl"
        >
          <Link href={`/creator/${creator.slug}`} role="menuitem" className={item}>
            Go to {creator.shortName}&rsquo;s shop
          </Link>
          <button type="button" role="menuitem" onClick={() => pick("hide")} className={item}>
            Hide this post
          </button>
          {kind === "making-of" && (
            <button type="button" role="menuitem" onClick={() => pick("fewer")} className={item}>
              Show fewer making-of posts
              <span className="block text-xs text-forest/55">
                You&rsquo;ll still see {creator.shortName}&rsquo;s new pieces
              </span>
            </button>
          )}
          <button type="button" role="menuitem" onClick={() => pick("unfollow")} className={item}>
            Unfollow {creator.name}
          </button>
          <div className="my-1 h-px bg-forest/10" />
          <button
            type="button"
            role="menuitem"
            onClick={() => pick("report")}
            className={`${item} text-clay-deep`}
          >
            Report this post
          </button>
        </div>
      )}
    </div>
  );
}
