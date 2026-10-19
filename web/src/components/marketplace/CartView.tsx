"use client";

import Link from "next/link";

import EmptyPanel, {
  PanelAction,
  PanelBody,
} from "@/components/marketplace/EmptyPanel";
import { useMarket } from "@/components/marketplace/MarketProvider";
import {
  MAX_QTY,
  useShopper,
} from "@/components/marketplace/ShopperProvider";
import { formatAmount, type Market } from "@/data/markets";
import { creatorOf, productsByCreator } from "@/data/marketplace";
import { priceCart, type Parcel, type PricedLine } from "@/lib/cart";
import { formatDateWindow, useToday } from "@/lib/delivery";

export default function CartView() {
  const { market, ready: marketReady } = useMarket();
  const shopper = useShopper();
  const today = useToday();

  if (!marketReady || !shopper.ready) return <CartSkeleton />;
  if (shopper.cart.length === 0) return <EmptyCart savedCount={shopper.saved.length} />;

  const summary = priceCart(shopper.cart, market);
  const piecesLabel = `${summary.pieceCount} ${summary.pieceCount === 1 ? "piece" : "pieces"}`;

  return (
    <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-6 pt-10 lg:flex-row lg:items-start lg:gap-14">
      <main className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h1 className="font-display text-5xl text-forest">Your cart</h1>
          <p className="text-forest/65">
            {summary.blockedCount > 0
              ? `${piecesLabel} can be ordered`
              : `${piecesLabel} from ${summary.creatorCount} ${
                  summary.creatorCount === 1 ? "creator" : "creators"
                }`}
          </p>
        </div>

        <ol className="mt-6 space-y-6">
          {summary.parcels.map((parcel, index) => (
            <li key={parcel.creator.slug}>
              <ParcelCard
                parcel={parcel}
                number={index + 1}
                market={market}
                today={today}
              />
            </li>
          ))}
        </ol>
      </main>

      <aside className="w-full rounded-3xl bg-white p-8 lg:sticky lg:top-6 lg:w-[33rem] lg:shrink-0">
        <h2 className="text-xl font-semibold text-forest">Summary</h2>
        <dl className="mt-5 space-y-3 text-forest">
          <SummaryRow label="Pieces" value={formatAmount(summary.pieces, market)} />
          <SummaryRow
            label={`Shipping, ${summary.orderableParcels} ${
              summary.orderableParcels === 1 ? "parcel" : "parcels"
            }`}
            value={formatAmount(summary.shipping, market)}
          />
          {summary.hasDuty && (
            <SummaryRow
              label={market.dutyLabel}
              value={formatAmount(summary.duty, market)}
            />
          )}
        </dl>

        <div className="mt-5 flex items-baseline justify-between border-t border-forest/10 pt-5">
          <span className="text-xl font-semibold text-forest">Total</span>
          <span className="font-display text-4xl text-forest">
            {formatAmount(summary.total, market)}
          </span>
        </div>

        {summary.pieceCount > 0 ? (
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-clay py-4 text-center text-lg font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            {summary.blockedCount > 0 ? `Checkout ${piecesLabel}` : "Checkout"}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-full bg-sand py-4 text-lg font-semibold text-forest/45"
          >
            Nothing can be ordered yet
          </button>
        )}

        <p className="mt-4 text-sm text-forest/65">
          {summary.hasDuty && "Duty shown now so there's nothing to pay at the door. "}
          FITS holds your payment until each parcel arrives.
        </p>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt>{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function ParcelCard({
  parcel,
  number,
  market,
  today,
}: {
  parcel: Parcel;
  number: number;
  market: Market;
  today: Date | null;
}) {
  const { creator } = parcel;

  return (
    <section
      aria-label={`Parcel ${number} from ${creator.name}`}
      className="rounded-3xl bg-white px-8 py-6"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 pb-5">
        <p className="flex items-center gap-3">
          <span aria-hidden className={`h-11 w-11 shrink-0 rounded-full ${creator.tone}`} />
          <Link
            href={`/creator/${creator.slug}`}
            className="text-lg font-semibold text-forest hover:text-clay"
          >
            {creator.name}
            {creator.verified && <span className="text-moss"> ✓</span>}
          </Link>
          <span className="text-forest/55">
            {creator.city}, {creator.country}
          </span>
        </p>
        <p className="font-medium text-forest">
          Parcel {number}
          {parcel.arrives && today && (
            <> · arrives {formatDateWindow(parcel.arrives, today)}</>
          )}
          {!parcel.orderable && <span className="text-forest/55"> · can&rsquo;t be sent</span>}
        </p>
      </header>

      <ul className="divide-y divide-forest/10">
        {parcel.lines.map((item) => (
          <CartLineRow key={item.line.key} item={item} market={market} />
        ))}
      </ul>

      <footer className="flex items-baseline justify-between gap-4 border-t border-forest/10 pt-5 text-forest/75">
        <span>
          Shipping from {creator.city}, {creator.country} to {market.placeName}
        </span>
        {parcel.orderable ? (
          <span className="font-semibold text-forest">
            {formatAmount(parcel.shipping, market)}
          </span>
        ) : (
          <span className="text-forest/45">Not charged</span>
        )}
      </footer>
    </section>
  );
}

function CartLineRow({ item, market }: { item: PricedLine; market: Market }) {
  const { setQty, removeLine, saveForLater } = useShopper();
  const { setPickerOpen } = useMarket();
  const { line, product, blocker, amount } = item;
  const blocked = blocker !== null;

  const details = [
    line.measurements ? "Custom measurements" : line.size ? `Size ${line.size}` : null,
    line.colour,
    line.note ? "note added" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex flex-wrap items-center gap-x-6 gap-y-4 py-5 sm:flex-nowrap">
      <Link
        href={`/product/${product.id}`}
        aria-label={product.name}
        className={`h-32 w-28 shrink-0 rounded-xl ${product.tone} ${blocked ? "opacity-60" : ""}`}
      />

      <div className="min-w-0 flex-1">
        <h3 className={`text-lg font-semibold ${blocked ? "text-forest/50" : "text-forest"}`}>
          <Link href={`/product/${product.id}`} className="hover:text-clay">
            {product.name}
          </Link>
        </h3>
        {details && (
          <p className={blocked ? "text-forest/45" : "text-forest/65"}>{details}</p>
        )}
        <Status item={item} market={market} onChangeShipTo={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setPickerOpen(true);
        }} />
      </div>

      <div className="flex items-center gap-6">
        <div
          className={`flex items-center rounded-full border border-forest/15 ${
            blocked ? "opacity-50" : ""
          }`}
        >
          <button
            type="button"
            disabled={blocked}
            onClick={() => setQty(line.key, line.qty - 1)}
            aria-label={line.qty === 1 ? `Remove ${product.name}` : `One fewer ${product.name}`}
            className="h-12 w-11 text-lg text-forest disabled:cursor-not-allowed"
          >
            −
          </button>
          <span aria-live="polite" className="w-6 text-center font-semibold text-forest">
            {line.qty}
            <span className="sr-only"> in cart</span>
          </span>
          <button
            type="button"
            disabled={blocked || line.qty >= MAX_QTY}
            onClick={() => setQty(line.key, line.qty + 1)}
            aria-label={`One more ${product.name}`}
            className="h-12 w-11 text-lg text-forest disabled:cursor-not-allowed disabled:text-forest/30"
          >
            +
          </button>
        </div>

        <span
          className={`w-16 text-right font-display text-xl ${
            blocked ? "text-forest/45" : "text-forest"
          }`}
        >
          {formatAmount(amount, market)}
        </span>

        {/* A sold piece is gone; one that cannot reach this country may later. */}
        {blocker === "sold-out" ? (
          <button
            type="button"
            onClick={() => removeLine(line.key)}
            className="w-28 text-left text-forest/55 transition-colors hover:text-forest"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={() => saveForLater(line.key)}
            className="w-28 text-left text-forest/55 transition-colors hover:text-forest"
          >
            Save for later
          </button>
        )}
      </div>
    </li>
  );
}

function Status({
  item,
  market,
  onChangeShipTo,
}: {
  item: PricedLine;
  market: Market;
  onChangeShipTo: () => void;
}) {
  const { product, blocker } = item;

  if (blocker === "sold-out") {
    const creator = creatorOf(product);
    const similar = productsByCreator(creator.name).filter(
      (other) => other.id !== product.id && !other.soldOut,
    );
    return (
      <p className="mt-1 text-clay-soft">
        Sold out since you added it
        {similar.length > 0 && (
          <>
            {" · "}
            <Link href={`/creator/${creator.slug}`} className="hover:text-clay">
              {creator.shortName} has {similar.length} similar{" "}
              {similar.length === 1 ? "piece" : "pieces"}
            </Link>
          </>
        )}
      </p>
    );
  }

  if (blocker === "not-open") {
    return (
      <p className="mt-1 text-clay-soft">
        Ordering opens once {creatorOf(product).shortName}&rsquo;s shop is verified
      </p>
    );
  }

  if (blocker === "no-delivery") {
    return (
      <p className="mt-1 text-clay-soft">
        Doesn&rsquo;t ship to {market.placeName} ·{" "}
        <button type="button" onClick={onChangeShipTo} className="underline hover:text-clay">
          Change ship-to
        </button>
      </p>
    );
  }

  return (
    <p className="mt-1 font-medium text-forest">
      {product.delivery ? `Made to order · ${product.delivery.maxDays} days` : "Ready to ship"}
    </p>
  );
}

function EmptyCart({ savedCount }: { savedCount: number }) {
  const savedHref = "/account/wishlist";
  const made = "Most are made to order, so the sooner you order, the sooner they're made.";

  return (
    <main className="mx-auto w-full max-w-[90rem] px-6 pt-10">
      <h1 className="font-display text-5xl text-forest">Your cart</h1>
      <EmptyPanel icon="cart" title="Nothing in your cart yet" className="mt-6">
        <PanelBody>
          {savedCount > 0
            ? `You have ${savedCount} saved ${savedCount === 1 ? "piece" : "pieces"}. ${made}`
            : `Most pieces here are made to order, so the sooner you order, the sooner they're made.`}
        </PanelBody>
        <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
          {savedCount > 0 ? (
            <>
              <PanelAction href={savedHref}>See saved pieces</PanelAction>
              <PanelAction variant="secondary" href="/category/fashion">
                Browse Fashion
              </PanelAction>
            </>
          ) : (
            <>
              <PanelAction href="/category/fashion">Browse Fashion</PanelAction>
              <PanelAction variant="secondary" href="/shop">
                Go to the shop
              </PanelAction>
            </>
          )}
        </div>
      </EmptyPanel>
    </main>
  );
}

function CartSkeleton() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[90rem] px-6 pt-10 motion-safe:animate-pulse">
      <div className="h-12 w-64 rounded-full bg-sand/70" />
      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="h-72 flex-1 rounded-3xl bg-sand/50" />
        <div className="h-72 rounded-3xl bg-sand/50 lg:w-[33rem]" />
      </div>
    </div>
  );
}
