"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "@/components/auth/SessionProvider";
import EmptyPanel, { PanelAction, PanelBody } from "@/components/marketplace/EmptyPanel";
import { useMarket } from "@/components/marketplace/MarketProvider";
import SaveToList from "@/components/marketplace/SaveToList";
import { useShopper, type SavedList } from "@/components/marketplace/ShopperProvider";
import { convert, formatAmount, formatMoney, type Market } from "@/data/markets";
import {
  creatorOf,
  getProduct,
  sizesFor,
  type Product,
} from "@/data/marketplace";
import { blockerFor } from "@/lib/cart";
import { arrivalWindow, formatDateWindow, useToday } from "@/lib/delivery";
import { useDismiss } from "@/lib/use-dismiss";

const ALL = "all";

export default function WishlistView({ initialList }: { initialList?: string }) {
  const shopper = useShopper();
  const { market, ready: marketReady } = useMarket();
  const { user, ready: sessionReady } = useSession();
  const [selected, setSelected] = useState<string>(initialList ?? ALL);

  if (!shopper.ready || !marketReady) return <WishlistSkeleton />;

  const savedProducts = [...shopper.saved]
    .reverse()
    .map((id) => getProduct(id))
    .filter((product): product is Product => Boolean(product));

  const list = shopper.lists.find((item) => item.id === selected) ?? null;
  const shown = list
    ? savedProducts.filter((product) => list.productIds.includes(product.id))
    : savedProducts;

  const listsLabel = shopper.lists.length
    ? ` in ${shopper.lists.length} ${shopper.lists.length === 1 ? "list" : "lists"}`
    : "";

  return (
    <main className="mx-auto w-full max-w-[90rem] px-6 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-4xl text-forest">Saved pieces</h1>
          {savedProducts.length > 0 && (
            <p className="text-forest/60">
              {savedProducts.length} {savedProducts.length === 1 ? "piece" : "pieces"}
              {listsLabel}
            </p>
          )}
        </div>
        <NewListButton onCreated={setSelected} />
      </div>

      {sessionReady && !user && savedProducts.length > 0 && (
        <p className="mt-4 text-sm text-forest/65">
          Saved on this device.{" "}
          <Link
            href="/login?next=/account/wishlist"
            className="font-medium text-clay underline hover:text-clay-deep"
          >
            Log in
          </Link>{" "}
          to keep them on every device.
        </p>
      )}

      {savedProducts.length === 0 ? (
        <EmptyPanel icon="heart" title="Nothing saved yet" className="mt-6">
          <PanelBody>
            Tap the heart on any piece to keep it here. We&rsquo;ll tell you if the
            price drops, if only a few are left, or when a new creator starts taking
            orders.
          </PanelBody>
          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
            <PanelAction href="/category/fashion">Browse Fashion</PanelAction>
            <PanelAction variant="secondary" href="/feed">
              Go to your feed
            </PanelAction>
          </div>
        </EmptyPanel>
      ) : (
        <>
          <div role="group" aria-label="Lists" className="mt-6 flex flex-wrap gap-2.5">
            <ListChip selected={!list} onClick={() => setSelected(ALL)}>
              All · {savedProducts.length}
            </ListChip>
            {shopper.lists.map((item) => (
              <ListChip
                key={item.id}
                selected={item.id === list?.id}
                onClick={() => setSelected(item.id)}
              >
                {item.name} · {item.productIds.length}
              </ListChip>
            ))}
          </div>

          {list && <ListHeader list={list} products={shown} market={market} />}

          {list && shown.length === 0 ? (
            <p className="mt-6 rounded-3xl bg-white px-8 py-10 text-forest/70">
              Nothing in {list.name} yet. Use the heart on any piece to add it here.
            </p>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((product) => (
                <li key={product.id}>
                  <SavedCard product={product} market={market} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

function ListChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        selected
          ? "border-forest bg-forest text-cream"
          : "border-forest/20 text-forest hover:border-forest/50"
      }`}
    >
      {children}
    </button>
  );
}

function NewListButton({ onCreated }: { onCreated: (listId: string) => void }) {
  const { createList } = useShopper();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [shared, setShared] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setName("");
    setShared(false);
  }, []);
  useDismiss(wrapper, open, close);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onCreated(createList(name, shared));
    close();
  }

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        className={`rounded-full border px-5 py-2.5 font-semibold text-forest transition-colors ${
          open ? "border-forest" : "border-forest/25 hover:border-forest/50"
        }`}
      >
        + New list
      </button>

      {open && (
        <form
          onSubmit={submit}
          aria-label="New list"
          className="absolute right-0 top-full z-40 mt-3 w-[23rem] max-w-[calc(100vw-3rem)] rounded-3xl border border-forest/10 bg-white p-6 shadow-xl"
        >
          <h2 className="text-lg font-semibold text-forest">New list</h2>
          <label className="mt-4 block">
            <span className="text-sm text-forest/70">Name</span>
            <input
              ref={input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              placeholder="e.g. Wedding in December"
              className="mt-1.5 w-full rounded-xl border-2 border-forest/80 px-4 py-3 text-forest outline-none focus:border-forest"
            />
          </label>

          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <span className="relative mt-0.5 inline-flex shrink-0">
              <input
                type="checkbox"
                checked={shared}
                onChange={(event) => setShared(event.target.checked)}
                className="peer sr-only"
              />
              <span className="block h-6 w-11 rounded-full bg-forest/15 transition-colors peer-checked:bg-moss peer-focus-visible:ring-2 peer-focus-visible:ring-forest peer-focus-visible:ring-offset-2" />
              <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
            <span>
              <span className="block font-medium text-forest">
                Anyone with the link can see it
              </span>
              <span className="mt-1 block text-sm text-forest/60">
                Useful for a wedding party or a gift list. Prices stay visible; your
                sizes don&rsquo;t.
              </span>
            </span>
          </label>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-forest/20 px-5 py-2.5 font-semibold text-forest hover:border-forest/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-full bg-clay px-5 py-2.5 font-semibold text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
            >
              Create list
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/** The selected list: what it costs together, when it would all arrive, and bulk actions. */
function ListHeader({
  list,
  products,
  market,
}: {
  list: SavedList;
  products: Product[];
  market: Market;
}) {
  const shopper = useShopper();
  const today = useToday();
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(list.name);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => setName(list.name), [list.name]);

  const orderable = products.filter((product) => !blockerFor(product, market));
  const together = products.reduce((sum, product) => sum + convert(product.priceGBP, market), 0);
  const slowest = Math.max(
    0,
    ...orderable.map((product) => arrivalWindow(product, creatorOf(product)).maxDays),
  );

  async function share() {
    if (!list.shared) shopper.setListShared(list.id, true);
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/account/wishlist?list=${list.id}`,
      );
      setNote("Link copied. Anyone with it can see this list.");
    } catch {
      setNote("Couldn't copy the link. Try again.");
    }
  }

  function addAll() {
    let added = 0;
    let needsSize = 0;
    for (const product of orderable) {
      if (sizesFor(product).length > 0) {
        needsSize += 1;
        continue;
      }
      shopper.addToCart({
        productId: product.id,
        size: null,
        measurements: null,
        colour: product.colours?.[0]?.name ?? null,
        note: "",
      });
      added += 1;
    }
    const parts = [`Added ${added} to your cart`];
    if (needsSize) parts.push(`${needsSize} ${needsSize === 1 ? "needs" : "need"} a size first`);
    if (orderable.length < products.length) {
      parts.push(`${products.length - orderable.length} can't be ordered yet`);
    }
    setNote(parts.join(" · "));
  }

  const count = products.length;

  return (
    <section className="mt-5 rounded-3xl bg-white px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          {renaming ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim()) shopper.renameList(list.id, name);
                setRenaming(false);
              }}
              className="flex gap-2"
            >
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={40}
                aria-label="List name"
                className="rounded-xl border-2 border-forest/80 px-3 py-1.5 text-lg font-semibold text-forest outline-none"
              />
              <button type="submit" className="rounded-xl bg-forest px-4 font-semibold text-cream">
                Save
              </button>
            </form>
          ) : (
            <h2 className="text-xl font-semibold text-forest">{list.name}</h2>
          )}
          <p className="mt-1 text-sm text-forest/60">
            {count} {count === 1 ? "piece" : "pieces"} · {formatAmount(together, market)} together ·{" "}
            {list.shared ? "anyone with the link can see it" : "only you can see it"}
            {today && orderable.length > 0 && (
              <>
                {" "}
                · if ordered today, everything arrives by{" "}
                {formatDateWindow({ minDays: slowest, maxDays: slowest }, today)}
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRenaming((value) => !value)}
            className="rounded-full border border-forest/20 px-5 py-2.5 font-semibold text-forest hover:border-forest/50"
          >
            {renaming ? "Cancel" : "Rename"}
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-full bg-forest px-5 py-2.5 font-semibold text-cream hover:bg-forest-deep"
          >
            {list.shared ? "Copy share link" : "Share list"}
          </button>
          <button
            type="button"
            onClick={addAll}
            disabled={orderable.length === 0}
            className="rounded-full bg-clay px-5 py-2.5 font-semibold text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
          >
            Add all to cart
          </button>
        </div>
      </div>
      {note && (
        <p role="status" className="mt-3 text-sm font-medium text-forest">
          {note}
          {note.startsWith("Added") && (
            <>
              {" · "}
              <Link href="/cart" className="text-clay underline hover:text-clay-deep">
                View cart
              </Link>
            </>
          )}
        </p>
      )}
    </section>
  );
}

/** The one thing worth knowing about a saved piece right now. */
function badgeFor(product: Product, market: Market) {
  const blocker = blockerFor(product, market);
  if (blocker === "sold-out") {
    return { label: "No longer available", className: "bg-cream/90 text-forest/50" };
  }
  if (blocker === "not-open") {
    return { label: "Not yet orderable", className: "bg-cream text-clay-deep" };
  }
  if (blocker === "no-delivery") {
    return { label: `Doesn't ship to ${market.placeName}`, className: "bg-cream text-clay-deep" };
  }
  if (product.priceWasGBP && product.priceWasGBP > product.priceGBP) {
    const drop = convert(product.priceWasGBP, market) - convert(product.priceGBP, market);
    return { label: `Price dropped ${formatAmount(drop, market)}`, className: "bg-sage text-forest" };
  }
  if (product.stockLeft !== undefined && product.stockLeft <= 3) {
    return { label: `Only ${product.stockLeft} left`, className: "bg-clay-wash text-clay-deep" };
  }
  if (product.delivery) {
    return {
      label: `Made to order · ${product.delivery.maxDays} days`,
      className: "bg-cream text-forest",
    };
  }
  return { label: "Ready to ship", className: "bg-sage text-forest" };
}

function SavedCard({ product, market }: { product: Product; market: Market }) {
  const shopper = useShopper();
  const [added, setAdded] = useState(false);
  const creator = creatorOf(product);
  const blocker = blockerFor(product, market);
  const badge = badgeFor(product, market);
  const gone = blocker === "sold-out";

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2000);
    return () => window.clearTimeout(timer);
  }, [added]);

  const pill = "rounded-full px-4 py-2 text-sm font-semibold transition-colors";
  let action: React.ReactNode;
  if (blocker === "sold-out") {
    action = (
      <Link href={`/category/${product.category}`} className={`${pill} bg-sand text-forest/60 hover:text-forest`}>
        See similar
      </Link>
    );
  } else if (blocker === "not-open") {
    const following = shopper.isFollowing(creator.slug);
    action = (
      <button
        type="button"
        onClick={() => shopper.toggleFollow(creator.slug)}
        aria-pressed={following}
        className={`${pill} bg-sand text-forest hover:bg-sand/70`}
      >
        {following ? "We'll tell you" : "Notify me"}
      </button>
    );
  } else if (blocker === "no-delivery") {
    action = (
      <Link href={`/product/${product.id}`} className={`${pill} bg-sand text-forest/60 hover:text-forest`}>
        View piece
      </Link>
    );
  } else if (sizesFor(product).length > 0) {
    action = (
      <Link href={`/product/${product.id}`} className={`${pill} bg-clay text-cream hover:bg-clay-deep`}>
        Choose size
      </Link>
    );
  } else {
    action = (
      <button
        type="button"
        onClick={() => {
          shopper.addToCart({
            productId: product.id,
            size: null,
            measurements: null,
            colour: product.colours?.[0]?.name ?? null,
            note: "",
          });
          setAdded(true);
        }}
        className={`${pill} ${added ? "bg-forest text-cream" : "bg-clay text-cream hover:bg-clay-deep"}`}
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
    );
  }

  return (
    <article>
      <div className={`relative aspect-[10/9] rounded-2xl ${product.tone} ${gone ? "opacity-60" : ""}`}>
        <Link href={`/product/${product.id}`} aria-label={product.name} className="absolute inset-0 rounded-2xl" />
        <div className="absolute right-3 top-3">
          <SaveToList
            product={product}
            placement="below"
            className="h-10 w-10 border border-transparent bg-cream/95 text-lg"
          />
        </div>
        <span
          className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <h2 className={`mt-3 font-semibold ${gone ? "text-forest/50" : "text-forest"}`}>
        <Link href={`/product/${product.id}`} className="hover:text-clay">
          {product.name}
        </Link>
      </h2>
      <p className={`text-sm ${gone ? "text-forest/40" : "text-forest/60"}`}>
        {creator.name} · {creator.country}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className={`font-display text-lg ${gone ? "text-forest/45" : "text-forest"}`}>
          {formatMoney(product.priceGBP, market)}
          {product.priceWasGBP && product.priceWasGBP > product.priceGBP && !gone && (
            <s className="ml-1.5 font-sans text-sm font-normal text-forest/45">
              {formatMoney(product.priceWasGBP, market)}
            </s>
          )}
        </p>
        {action}
      </div>
    </article>
  );
}

function WishlistSkeleton() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[90rem] px-6 pt-8 motion-safe:animate-pulse">
      <div className="h-10 w-72 rounded-full bg-sand/70" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="aspect-[10/9] rounded-2xl bg-sand/60" />
        ))}
      </div>
    </div>
  );
}
