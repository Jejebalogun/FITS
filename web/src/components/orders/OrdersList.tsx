"use client";

import Link from "next/link";
import { useState } from "react";

import EmptyPanel, { PanelAction, PanelBody } from "@/components/marketplace/EmptyPanel";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import AccountNav from "@/components/orders/AccountNav";
import { statusLabel } from "@/components/orders/ParcelCard";
import { useOrders } from "@/components/orders/useOrders";
import type { Stage } from "@/data/orders";
import type { Parcel } from "@/lib/cart";
import {
  bucketOf,
  dateOf,
  dueWindow,
  formatDay,
  formatWindow,
  isCustom,
  needsAction,
  type Bucket,
  type TrackedOrder,
} from "@/lib/orders";

const TABS: { key: Bucket; label: string }[] = [
  { key: "progress", label: "In progress" },
  { key: "delivered", label: "Delivered" },
  { key: "refunded", label: "Cancelled and refunded" },
];

export default function OrdersList() {
  const { ready, orders, stageOf, signedIn } = useOrders();
  const [tab, setTab] = useState<Bucket>("progress");

  const rows = orders.map((order) => {
    const stages = order.summary.parcels.map((parcel) => stageOf(order, parcel.creator.slug));
    return { order, stages, bucket: bucketOf(stages) };
  });
  const counts = Object.fromEntries(
    TABS.map((item) => [item.key, rows.filter((row) => row.bucket === item.key).length]),
  ) as Record<Bucket, number>;
  const shown = rows.filter((row) => row.bucket === tab);

  return (
    <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-6 pt-8 lg:flex-row lg:gap-10">
      <AccountNav badge={counts.progress || undefined} fallbackName={orders[0]?.name} />

      <main className="min-w-0 flex-1">
        <h1 className="font-display text-4xl text-forest">My purchases</h1>

        {ready && !signedIn && (
          <p className="mt-3 text-sm text-forest/65">
            Showing orders placed on this device.{" "}
            <Link href="/login?next=/account/orders" className="font-medium text-clay underline">
              Log in
            </Link>{" "}
            to see the rest.
          </p>
        )}

        <div role="tablist" className="mt-6 flex gap-8 overflow-x-auto border-b border-forest/15">
          {TABS.map((item) => {
            const active = item.key === tab;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.key)}
                className={`-mb-px flex items-center gap-2.5 whitespace-nowrap border-b-2 pb-3 font-semibold transition-colors ${
                  active ? "border-clay text-forest" : "border-transparent text-forest/50 hover:text-forest/75"
                }`}
              >
                {item.label}
                {ready && counts[item.key] > 0 && (
                  <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-forest/70">
                    {counts[item.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!ready ? (
          <div aria-hidden className="mt-6 space-y-4 motion-safe:animate-pulse">
            <div className="h-40 rounded-3xl bg-sand/50" />
            <div className="h-40 rounded-3xl bg-sand/50" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyPanel icon="cart" title="No purchases yet" className="mt-6">
            <PanelBody>
              When you order, each piece shows here with where it&rsquo;s got to — from the
              creator accepting it to the courier at your door.
            </PanelBody>
            <div className="mt-7">
              <PanelAction href="/shop">Go to the shop</PanelAction>
            </div>
          </EmptyPanel>
        ) : shown.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-white px-8 py-10 text-forest/70">
            {tab === "progress"
              ? "Nothing on its way right now."
              : tab === "delivered"
                ? "Nothing delivered yet."
                : "Nothing cancelled or refunded."}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {shown.map(({ order, stages }) => (
              <li key={order.id}>
                <OrderRow order={order} stages={stages} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function OrderRow({ order, stages }: { order: TrackedOrder; stages: Stage[] }) {
  return (
    <article className="rounded-3xl bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg text-forest">
          <span className="font-semibold">
            Order <span className="font-mono">{order.id}</span>
          </span>
          <span className="text-sm text-forest/55">
            {" "}
            · placed {formatDay(order.placedAt)} · {order.paid}
          </span>
        </h2>
        <Link href={`/orders/${order.id}`} className="font-medium text-clay hover:text-clay-deep">
          View order →
        </Link>
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {order.summary.parcels.flatMap((parcel, index) =>
          parcel.lines.map((item) => (
            <LineRow
              key={item.line.key}
              order={order}
              parcel={parcel}
              stage={stages[index]}
              productName={item.product.name}
              tone={item.product.tone}
            />
          )),
        )}
      </ul>
    </article>
  );
}

function LineRow({
  order,
  parcel,
  stage,
  productName,
  tone,
}: {
  order: TrackedOrder;
  parcel: Parcel;
  stage: Stage;
  productName: string;
  tone: string;
}) {
  const { updateParcel } = useShopper();
  const awaiting = stage.kind === "delivered";
  const pill = pillFor(order, parcel, stage);

  return (
    <li
      className={`flex items-center gap-4 rounded-2xl p-3 ${
        awaiting ? "border border-clay/50 bg-clay-wash/30 md:col-span-2" : "bg-cream"
      }`}
    >
      <span aria-hidden className={`h-16 w-14 shrink-0 rounded-xl ${tone}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-forest">{productName}</p>
        <p className="truncate text-sm text-forest/60">{parcel.creator.name}</p>
        <span
          className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${pill.tone}`}
        >
          {pill.label}
        </span>
      </div>
      {awaiting && (
        <button
          type="button"
          onClick={() =>
            updateParcel(order.id, parcel.creator.slug, { confirmedAt: new Date().toISOString() })
          }
          className="shrink-0 rounded-full bg-clay px-5 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep"
        >
          Confirm it arrived
        </button>
      )}
    </li>
  );
}

function pillFor(order: TrackedOrder, parcel: Parcel, stage: Stage) {
  const window = formatWindow(order, dueWindow(parcel, stage));
  const label = statusLabel(stage, isCustom(parcel));
  switch (stage.kind) {
    case "making":
      return { label: `${label} · arrives ${window}`, tone: "bg-clay-wash text-clay-deep" };
    case "packing":
      return { label: `Packing · arrives ${window}`, tone: "bg-sage text-forest" };
    case "late":
      return { label: `${label} · new date ${window}`, tone: "bg-clay-wash text-clay-deep" };
    case "shipped":
      return { label: `${label} · arrives ${formatDay(dateOf(order, stage.eta))}`, tone: "bg-forest text-cream" };
    case "delivered":
      return { label: "Delivered · please confirm", tone: "bg-clay text-cream" };
    case "confirmed":
      return {
        label: `Delivered ${formatDay(dateOf(order, stage.milestones.delivered!))}`,
        tone: "bg-sage text-forest",
      };
    case "declined":
    case "cancelled":
    case "problem":
      return { label, tone: "bg-clay text-cream" };
    default:
      return { label, tone: needsAction(stage) ? "bg-clay text-cream" : "bg-clay-wash text-clay-deep" };
  }
}
