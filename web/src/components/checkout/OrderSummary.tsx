"use client";

import { formatAmount, formatMoney, type Market } from "@/data/markets";
import type { CartSummary } from "@/lib/cart";
import { arrivalWindow, formatDateWindow, useToday } from "@/lib/delivery";

/** The same breakdown on every step, so the total never moves under the buyer. */
export default function OrderSummary({
  summary,
  market,
  /** Shown instead of the market total when paying in another currency. */
  payingIn,
  from,
}: {
  summary: CartSummary;
  market: Market;
  payingIn?: { amount: number; market: Market };
  /** Arrival dates count from here: today while buying, the order date after. */
  from?: Date;
}) {
  const now = useToday();
  const today = from ?? now;
  const lines = summary.parcels.flatMap((parcel) =>
    parcel.lines
      .filter((item) => !item.blocker)
      .map((item) => ({ ...item, creator: parcel.creator })),
  );
  const money = (amount: number) => formatAmount(amount, market, { cents: true });
  const pieces = summary.pieceCount;

  return (
    <aside className="rounded-3xl bg-white p-7 lg:sticky lg:top-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-forest">Order summary</h2>
        <p className="text-sm text-forest/55">
          {pieces} {pieces === 1 ? "piece" : "pieces"} · {summary.orderableParcels}{" "}
          {summary.orderableParcels === 1 ? "parcel" : "parcels"}
        </p>
      </div>

      <ul className="mt-5 divide-y divide-forest/10">
        {lines.map(({ line, product, creator }) => (
          <li key={line.key} className="flex gap-4 py-4 first:pt-0">
            <span aria-hidden className={`h-20 w-16 shrink-0 rounded-xl ${product.tone}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold text-forest">
                  {product.name}
                  {line.qty > 1 && <span className="font-normal text-forest/60"> × {line.qty}</span>}
                </p>
                <p className="font-semibold text-forest">
                  {formatMoney(product.priceGBP * line.qty, market)}
                </p>
              </div>
              <p className="text-sm text-forest/60">
                {creator.name}
                {line.measurements
                  ? " · custom measurements"
                  : line.size
                    ? ` · size ${line.size}`
                    : ""}
              </p>
              {today && (
                <p className="mt-1.5 text-sm font-medium text-forest">
                  Arrives {formatDateWindow(arrivalWindow(product, creator), today)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-2.5 border-t border-forest/10 pt-5 text-forest">
        <Row label="Pieces" value={money(summary.pieces)} />
        <Row
          label={`Delivery · ${summary.orderableParcels} ${
            summary.orderableParcels === 1 ? "parcel" : "parcels"
          }`}
          value={money(summary.shipping)}
        />
        {summary.hasDuty && (
          <Row label="Import duty and VAT, paid now" value={money(summary.duty)} />
        )}
      </dl>

      <div className="mt-5 border-t border-forest/10 pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold text-forest">Total</span>
          <span className="font-display text-3xl text-forest">
            {payingIn
              ? formatAmount(payingIn.amount, payingIn.market)
              : money(summary.total)}
          </span>
        </div>
        <p className="mt-1 text-sm text-forest/60">
          {payingIn && <>≈ {money(summary.total)} · </>}
          {summary.hasDuty
            ? "Nothing more to pay when the parcels arrive."
            : "No duty to pay — every parcel ships within the country."}
        </p>
      </div>

      <div className="mt-5 rounded-2xl bg-forest-deep px-5 py-4 text-cream">
        <p className="font-semibold">Your money is held until each piece arrives</p>
        <p className="mt-1 text-sm text-cream/70">
          Creators are paid only after you confirm delivery. If a piece never comes,
          you get your money back.
        </p>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

