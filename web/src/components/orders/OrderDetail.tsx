"use client";

import Link from "next/link";

import Breadcrumb from "@/components/marketplace/Breadcrumb";
import EmptyPanel, { PanelAction, PanelBody } from "@/components/marketplace/EmptyPanel";
import ParcelCard from "@/components/orders/ParcelCard";
import { useOrders } from "@/components/orders/useOrders";
import type { Stage } from "@/data/orders";
import { formatDay, money, parcelTotal, type TrackedOrder } from "@/lib/orders";

export default function OrderDetail({ orderId }: { orderId: string }) {
  const { ready, orders, stageOf, now, signedIn } = useOrders();

  if (!ready) {
    return (
      <div aria-hidden className="mx-auto w-full max-w-[90rem] px-6 pt-8 motion-safe:animate-pulse">
        <div className="h-10 w-72 rounded-full bg-sand/70" />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr_21rem]">
          <div className="h-[30rem] rounded-3xl bg-sand/50" />
          <div className="h-[30rem] rounded-3xl bg-sand/50" />
          <div className="h-56 rounded-3xl bg-sand/50" />
        </div>
      </div>
    );
  }

  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    return (
      <main className="mx-auto w-full max-w-[90rem] px-6 pt-8">
        <EmptyPanel icon="cart" title={`We can't find order ${orderId} here`} className="">
          <PanelBody>
            {signedIn
              ? "It isn't one of your orders on this device. Check the number in your receipt email."
              : "Orders placed on another device show up once you log in. Your receipt email has the order number."}
          </PanelBody>
          <div className="mt-7 flex flex-wrap gap-3">
            <PanelAction href="/account/orders">My purchases</PanelAction>
            {!signedIn && (
              <PanelAction variant="secondary" href={`/login?next=/orders/${orderId}`}>
                Log in
              </PanelAction>
            )}
          </div>
        </EmptyPanel>
      </main>
    );
  }

  const parcels = order.summary.parcels;
  const stages = parcels.map((parcel) => stageOf(order, parcel.creator.slug));
  const pieces = order.summary.pieceCount;

  return (
    <main className="mx-auto w-full max-w-[90rem] px-6 pt-7">
      <Breadcrumb items={[{ label: "My purchases", href: "/account/orders" }, { label: order.id }]} />
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-forest">Order {order.id}</h1>
          <p className="mt-1 text-forest/65">
            Placed {formatDay(order.placedAt)} · {pieces} {pieces === 1 ? "piece" : "pieces"} from{" "}
            {parcels.length === 1
              ? parcels[0].creator.name
              : `${parcels.length} creators · arriving separately`}
          </p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-forest/25 px-5 py-2.5 font-semibold text-forest hover:border-forest/50"
          >
            Receipt
          </button>
          <Link
            href="/help/contact"
            className="rounded-full border border-forest/25 px-5 py-2.5 font-semibold text-forest hover:border-forest/50"
          >
            Get help
          </Link>
        </div>
      </div>

      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid items-start gap-5 md:grid-cols-2">
          {parcels.map((parcel, index) => (
            <ParcelCard
              key={parcel.creator.slug}
              order={order}
              parcel={parcel}
              stage={stages[index]}
              now={now}
            />
          ))}
        </div>
        <OrderAside order={order} stages={stages} />
      </div>
    </main>
  );
}

function OrderAside({ order, stages }: { order: TrackedOrder; stages: Stage[] }) {
  const parcels = order.summary.parcels;
  const refunded = parcels.filter((_, index) =>
    ["declined", "cancelled"].includes(stages[index].kind),
  );
  const refundTotal = refunded.reduce((sum, parcel) => sum + parcelTotal(order, parcel), 0);
  const complete = stages.every((stage) => stage.kind === "confirmed");
  const names = parcels.map((parcel) => parcel.creator.shortName);

  return (
    <aside className="space-y-4">
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest/55">
          Delivering to
        </h2>
        <p className="mt-3 text-forest">{order.name}</p>
        <p className="text-forest/80">{order.address}</p>
        <div className="my-5 h-px bg-forest/10" />
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest/55">Paid</h2>
        <dl className="mt-3 space-y-1.5 text-forest">
          <div className="flex justify-between gap-3">
            <dt>{order.paidWith}</dt>
            <dd className="font-semibold">{order.paid}</dd>
          </div>
          {refundTotal > 0 && (
            <div className="flex justify-between gap-3">
              <dt>Refunded</dt>
              <dd className="font-semibold">−{money(order, refundTotal)}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="rounded-3xl bg-forest-deep p-6 text-cream">
        {refunded.length > 0 ? (
          <>
            <h2 className="font-semibold">Refunds are automatic</h2>
            <p className="mt-1.5 text-sm text-cream/70">
              When a creator declines or doesn&rsquo;t reply in 48 hours, that piece is refunded in
              full. You don&rsquo;t have to ask.
            </p>
          </>
        ) : complete ? (
          <>
            <h2 className="font-semibold">Order complete</h2>
            <p className="mt-1.5 text-sm text-cream/70">
              {parcels.length === 1 ? `${names[0]} has` : parcels.length === 2 ? "Both creators have" : "Every creator has"}{" "}
              been paid. You can still report a problem for 30 days from delivery.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-semibold">Your money is held by FITS</h2>
            <p className="mt-1.5 text-sm text-cream/70">
              Each creator is paid only once you confirm their piece arrived.
              {parcels.length > 1 && ` ${names[1]} gets paid separately from ${names[0]}.`}
            </p>
          </>
        )}
      </section>
    </aside>
  );
}
