"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";
import SaveButton from "@/components/marketplace/SaveButton";
import { formatMoney } from "@/data/markets";
import { getCategory, type Creator, type Product } from "@/data/marketplace";
import { sortProducts, type SortKey } from "@/lib/marketplace-filters";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "arriving", label: "Arrives soonest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

const READY = "Ready to ship";

/**
 * The shop's own shelves: clothing by type ("Dresses & kaftans"), everything
 * else by craft ("Home"), and "Ready to ship" when the shop has both kinds.
 */
function shelvesFor(products: Product[]) {
  const shelves: string[] = [];
  for (const product of products) {
    const shelf = shelfOf(product);
    if (!shelves.includes(shelf)) shelves.push(shelf);
  }
  const ready = products.some((product) => !product.delivery);
  const made = products.some((product) => product.delivery);
  return ready && made ? [...shelves, READY] : shelves;
}

function shelfOf(product: Product) {
  if (product.category === "fashion") return product.type;
  const category = getCategory(product.category);
  return category?.shortName ?? category?.name ?? product.type;
}

type CatalogueTabProps = {
  creator: Creator;
  products: Product[];
  /** False while the shop's identity is still being confirmed. */
  open: boolean;
};

export default function CatalogueTab({ creator, products, open }: CatalogueTabProps) {
  const { ready } = useMarket();
  const [shelf, setShelf] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");

  const shelves = useMemo(() => shelvesFor(products), [products]);
  const visible = useMemo(() => {
    const onShelf = shelf
      ? products.filter((product) =>
          shelf === READY ? !product.delivery : shelfOf(product) === shelf,
        )
      : products;
    return sortProducts(onShelf, sort);
  }, [products, shelf, sort]);

  return (
    <>
      {!open && (
        <p className="mb-7 rounded-2xl border border-clay/40 bg-clay-wash/60 px-7 py-5 text-forest">
          <strong className="font-semibold">
            This creator is new and still being verified.
          </strong>{" "}
          You can browse and save pieces now. Ordering opens once FITS confirms the
          shop&rsquo;s identity, usually within a day. Follow to be told when it does.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Shelves" className="flex flex-wrap gap-3">
          <ShelfChip selected={shelf === null} onClick={() => setShelf(null)}>
            All
          </ShelfChip>
          {shelves.map((item) => (
            <ShelfChip
              key={item}
              selected={shelf === item}
              onClick={() => setShelf(item)}
            >
              {item}
            </ShelfChip>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-forest/70">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="rounded-xl border border-forest/15 bg-white px-5 py-3 text-base font-medium text-forest outline-none focus:border-forest"
          >
            {SORTS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!ready ? (
        <div
          aria-hidden
          className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="motion-safe:animate-pulse">
              <div className="aspect-[5/4] rounded-2xl bg-sand/70" />
              <div className="mt-4 h-4 w-2/3 rounded-full bg-sand/70" />
              <div className="mt-3 h-4 w-1/4 rounded-full bg-sand/70" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-7 grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product) => (
            <li key={product.id}>
              <StorefrontCard product={product} creator={creator} open={open} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ShelfChip({
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
      className={`rounded-full border px-5 py-2.5 font-medium transition-colors ${
        selected
          ? "border-forest bg-forest text-cream"
          : "border-forest/20 text-forest hover:border-forest/50"
      }`}
    >
      {children}
    </button>
  );
}

/** Shop cards drop the creator line — it is their shop — and say how soon. */
function StorefrontCard({
  product,
  creator,
  open,
}: {
  product: Product;
  creator: Creator;
  open: boolean;
}) {
  const { market } = useMarket();

  const badge = !open
    ? { label: "Not yet orderable", className: "bg-cream text-clay-deep" }
    : product.delivery
      ? { label: "Made to order", className: "bg-cream text-forest" }
      : { label: "Ready to ship", className: "bg-sage text-forest" };

  const timing = product.soldOut
    ? "sold out"
    : !open
      ? "opens soon"
      : product.stockLeft !== undefined
        ? `${product.stockLeft} left`
        : product.delivery
          ? `${product.delivery.maxDays} days`
          : `ships in ${creator.dispatchDays} ${creator.dispatchDays === 1 ? "day" : "days"}`;

  return (
    <article>
      <div className={`relative aspect-[5/4] overflow-hidden rounded-2xl ${product.tone}`}>
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0"
          aria-label={product.name}
        />
        <SaveButton product={product} className="absolute right-4 top-4 h-11 w-11 bg-cream/95 text-lg" />
        <span
          className={`absolute bottom-4 left-4 rounded-full px-3.5 py-1.5 text-sm font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-forest">
        <Link href={`/product/${product.id}`} className="hover:text-clay">
          {product.name}
        </Link>
      </h3>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <p className="font-display text-xl text-forest">
          {formatMoney(product.priceGBP, market)}
        </p>
        <p className={!open || product.soldOut ? "text-clay-deep" : "text-forest/60"}>
          {timing}
        </p>
      </div>
    </article>
  );
}
