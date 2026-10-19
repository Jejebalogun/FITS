"use client";

import CheckoutShell from "@/components/checkout/CheckoutShell";
import OrderSummary from "@/components/checkout/OrderSummary";
import EmptyPanel, { PanelAction, PanelBody } from "@/components/marketplace/EmptyPanel";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import { getMarket } from "@/data/markets";
import { priceCart, type Parcel } from "@/lib/cart";
import { formatDateWindow } from "@/lib/delivery";

export default function DoneView({ orderId }: { orderId?: string }) {
  const shopper = useShopper();
  const { ready: marketReady } = useMarket();

  if (!shopper.ready || !marketReady) {
    return <CheckoutShell step="done" summary={null}>{null}</CheckoutShell>;
  }

  const order = shopper.orders.find((item) => item.id === orderId);
  if (!order) {
    return (
      <CheckoutShell step="done" summary={null}>
        <EmptyPanel icon="cart" title="We can't find that order here" className="">
          <PanelBody>
            Orders placed on another device show up once you log in. Your receipt email
            has the order number and a tracking link.
          </PanelBody>
          <div className="mt-7 flex flex-wrap gap-3">
            <PanelAction href="/shop">Back to the shop</PanelAction>
            <PanelAction variant="secondary" href="/help/contact">
              Get help
            </PanelAction>
          </div>
        </EmptyPanel>
      </CheckoutShell>
    );
  }

  const market = getMarket(order.market);
  const placedAt = new Date(order.placedAt);
  const summary = priceCart(order.lines, market, { asOrdered: true });
  const firstName = order.name.trim().split(/\s+/)[0];

  return (
    <CheckoutShell
      step="done"
      summary={<OrderSummary summary={summary} market={market} from={placedAt} />}
    >
      <span
        aria-hidden
        className="flex h-16 w-16 items-center justify-center rounded-full bg-moss text-3xl text-cream"
      >
        ✓
      </span>
      <h1 className="mt-6 font-display text-4xl text-forest">
        Thank you, {firstName}. Your order is in.
      </h1>
      <p className="mt-2 text-forest/75">
        Order <strong className="font-mono font-bold text-forest">{order.id}</strong> ·{" "}
        {order.paid} paid · receipt sent to {order.email}
      </p>
      <p className="mt-5 text-forest/70">
        Your money is held by FITS. Each creator is paid only after you confirm their
        piece arrived.
        {order.createAccount &&
          " We've also emailed a link to set a password, so you can track this order from your account."}
      </p>

      <h2 className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest/55">
        What happens next
      </h2>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2">
        {summary.parcels.map((parcel) => (
          <li key={parcel.creator.slug}>
            <NextSteps parcel={parcel} placedAt={placedAt} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <PanelAction href={`/orders/${order.id}`}>Track this order</PanelAction>
        <PanelAction variant="secondary" href="/shop">
          Keep shopping
        </PanelAction>
      </div>
    </CheckoutShell>
  );
}

/** One parcel's road from the workshop: who does what, and by when. */
function NextSteps({ parcel, placedAt }: { parcel: Parcel; placedAt: Date }) {
  const { creator } = parcel;
  const custom = parcel.lines.some((item) => item.line.measurements);
  const made = parcel.lines.some((item) => item.product.delivery);
  const pieces = parcel.lines
    .map(({ product, line }) =>
      [product.name, line.measurements ? "custom" : line.size].filter(Boolean).join(" · "),
    )
    .join(", ");

  const steps = made
    ? [
        custom
          ? `${creator.shortName} confirms your measurements — within 48 hours`
          : `${creator.shortName} confirms your order — within 48 hours`,
        `${creator.shortName} makes it, with progress photos`,
      ]
    : [
        `${creator.shortName} accepts and packs it — within 48 hours`,
        `FITS books the courier for ${creator.shortName}`,
      ];

  return (
    <article className="h-full rounded-2xl bg-white p-5">
      <p className="flex items-center gap-3">
        <span aria-hidden className={`h-10 w-10 shrink-0 rounded-full ${creator.tone}`} />
        <span className="min-w-0">
          <span className="block font-semibold text-forest">{creator.name}</span>
          <span className="block truncate text-sm text-forest/60">{pieces}</span>
        </span>
      </p>
      <ol className="mt-4 space-y-2 text-forest/85">
        {steps.map((text, index) => (
          <li key={text} className="flex gap-3">
            <span className="font-semibold text-clay">{index + 1}</span>
            {text}
          </li>
        ))}
        <li className="flex gap-3">
          <span className="font-semibold text-clay">3</span>
          <span>
            DHL brings it
            {parcel.arrives && (
              <>
                {" · "}
                <strong className="font-semibold text-forest">
                  {formatDateWindow(parcel.arrives, placedAt)}
                </strong>
              </>
            )}
          </span>
        </li>
      </ol>
    </article>
  );
}
