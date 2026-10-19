import type {
  CartLine,
  ParcelUpdate,
  PlacedOrder,
} from "@/components/marketplace/ShopperProvider";
import { formatAmount, getMarket, type Market, type MarketCode } from "@/data/markets";
import {
  demoAddress,
  demoOrders,
  type DemoOrder,
  type Stage,
  type Stamp,
} from "@/data/orders";
import { priceCart, type CartSummary, type Parcel } from "@/lib/cart";
import { arrivalWindow, formatDateWindow, type DayWindow } from "@/lib/delivery";

const DAY_MS = 86_400_000;
/** A creator has this long to accept before the buyer is refunded automatically. */
export const ACCEPT_HOURS = 48;
/** A delivered parcel confirms itself after this many days. */
export const AUTO_CONFIRM_DAYS = 7;
/** A buyer told a parcel is late has this long to choose before waiting is assumed. */
export const LATE_ANSWER_DAYS = 3;

export type TrackedOrder = {
  id: string;
  /** Midnight on the day it was placed; every Stamp counts from here. */
  placedOn: Date;
  placedAt: Date;
  market: Market;
  name: string;
  address: string;
  email?: string;
  paidWith: string;
  /** As charged, which may be in another currency than the market's. */
  paid: string;
  lines: CartLine[];
  summary: CartSummary;
  stages: Record<string, Stage>;
};

function midnight(date: Date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export function dateOf(order: TrackedOrder, stamp: Stamp) {
  const date = new Date(order.placedOn.getTime() + stamp.day * DAY_MS);
  const [hours, minutes] = (stamp.time ?? "12:00").split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function stampFrom(placedOn: Date, date: Date): Stamp {
  return {
    day: Math.round((midnight(date).getTime() - placedOn.getTime()) / DAY_MS),
    time: date.toTimeString().slice(0, 5),
  };
}

export function stampOf(order: TrackedOrder, date: Date): Stamp {
  return stampFrom(order.placedOn, date);
}

function build(
  base: Omit<TrackedOrder, "summary" | "paid" | "stages">,
  paid: string | null,
  stages: (summary: CartSummary) => Record<string, Stage>,
): TrackedOrder {
  const summary = priceCart(base.lines, base.market, { asOrdered: true });
  return {
    ...base,
    summary,
    paid: paid ?? formatAmount(summary.total, base.market, { cents: true }),
    stages: stages(summary),
  };
}

export function fromDemo(order: DemoOrder, today: Date): TrackedOrder {
  const placedOn = midnight(new Date(today.getTime() - order.placedDaysAgo * DAY_MS));
  const [hours, minutes] = order.placedTime.split(":").map(Number);
  const placedAt = new Date(placedOn);
  placedAt.setHours(hours, minutes);
  return build(
    {
      id: order.id,
      placedOn,
      placedAt,
      market: getMarket("GB"),
      ...demoAddress,
      lines: order.lines.map((line, index) => ({ ...line, key: `${order.id}-${index}` })),
    },
    null,
    () => order.stages,
  );
}

/**
 * An order placed on this device. Nothing moves it along yet, so every parcel
 * waits for its creator — and is refunded once the 48 hours run out, which is
 * the promise the order page makes.
 */
export function fromPlaced(order: PlacedOrder, now: Date): TrackedOrder {
  const placedAt = new Date(order.placedAt);
  const base = {
    id: order.id,
    placedOn: midnight(placedAt),
    placedAt,
    market: getMarket(order.market as MarketCode),
    name: order.name,
    address: order.address,
    email: order.email,
    paidWith: order.paidWith,
    lines: order.lines,
  };
  return build(base, order.paid, (summary) => {
    const deadlineAt = new Date(placedAt.getTime() + ACCEPT_HOURS * 3_600_000);
    const expired = now > deadlineAt;
    const deadline = stampFrom(base.placedOn, deadlineAt);
    return Object.fromEntries(
      summary.parcels.map((parcel) => [
        parcel.creator.slug,
        expired
          ? ({ kind: "declined", milestones: {}, at: deadline } as Stage)
          : ({ kind: "confirming", milestones: {} } as Stage),
      ]),
    );
  });
}

export function allOrders(
  placed: PlacedOrder[],
  includeDemo: boolean,
  now: Date,
): TrackedOrder[] {
  const mine = placed.map((order) => fromPlaced(order, now));
  const demo = includeDemo ? demoOrders.map((order) => fromDemo(order, now)) : [];
  return [...mine, ...demo].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
}

/** The stage once the buyer's own choices, and the passing of time, are applied. */
export function effectiveStage(
  order: TrackedOrder,
  slug: string,
  update: ParcelUpdate | undefined,
  now: Date,
): Stage {
  const base = order.stages[slug];
  if (!base) return { kind: "confirming", milestones: {} };

  if (base.kind === "late") {
    // Saying nothing for three days counts as agreeing to wait.
    const answerBy = new Date(dateOf(order, base.noticeAt).getTime() + LATE_ANSWER_DAYS * DAY_MS);
    if (update?.cancelledAt) {
      return { kind: "cancelled", milestones: base.milestones, at: stampOf(order, new Date(update.cancelledAt)) };
    }
    if (update?.waited || now > answerBy) {
      return { kind: "making", milestones: base.milestones, updates: base.updates, newWindow: base.newWindow };
    }
  }

  if (base.kind === "delivered") {
    if (update?.problem) {
      return {
        kind: "problem",
        milestones: base.milestones,
        reason: update.problem.reason,
        at: stampOf(order, new Date(update.problem.at)),
      };
    }
    const delivered = base.milestones.delivered;
    const autoAt = delivered
      ? new Date(dateOf(order, delivered).getTime() + AUTO_CONFIRM_DAYS * DAY_MS)
      : null;
    if (update?.confirmedAt || (autoAt && now > autoAt)) {
      return {
        kind: "confirmed",
        milestones: base.milestones,
        confirmedAt: stampOf(order, update?.confirmedAt ? new Date(update.confirmedAt) : autoAt!),
        review: update?.review,
      };
    }
  }

  if (base.kind === "confirmed" && update?.review) return { ...base, review: update.review };
  return base;
}

export type Bucket = "progress" | "delivered" | "refunded";

/** Which tab an order sits under. */
export function bucketOf(stages: Stage[]): Bucket {
  const refunded = (stage: Stage) => stage.kind === "declined" || stage.kind === "cancelled";
  if (stages.every(refunded)) return "refunded";
  if (stages.every((stage) => refunded(stage) || stage.kind === "confirmed")) return "delivered";
  return "progress";
}

export function needsAction(stage: Stage) {
  return stage.kind === "delivered" || stage.kind === "late";
}

/** A refund covers the piece, its parcel's delivery and its duty. */
export function parcelTotal(order: TrackedOrder, parcel: Parcel) {
  return parcel.lines.reduce((sum, item) => sum + item.amount, 0) + parcel.shipping + parcel.duty;
}

export function money(order: TrackedOrder, amount: number) {
  return formatAmount(Math.round(amount * 100) / 100, order.market, { cents: true });
}

/** "back on your Visa", "back in your PayPal" — where a refund lands. */
export function refundTo(paidWith: string) {
  if (paidWith.startsWith("PayPal")) return "back in your PayPal";
  if (paidWith.startsWith("Apple Pay")) return "back on the card in your Apple Pay";
  if (/transfer|USSD/i.test(paidWith)) return "sent back to the account you paid from";
  const brand = paidWith.replace(/^Nigerian /, "").split(" ")[0];
  return `back on your ${brand === "Card" ? "card" : brand}`;
}

/** The window a parcel is due in, honouring a date the buyer agreed to. */
export function dueWindow(parcel: Parcel, stage: Stage): DayWindow {
  if ((stage.kind === "late" || stage.kind === "making") && stage.newWindow) return stage.newWindow;
  const windows = parcel.lines.map((item) => arrivalWindow(item.product, parcel.creator));
  return {
    minDays: Math.max(...windows.map((window) => window.minDays)),
    maxDays: Math.max(...windows.map((window) => window.maxDays)),
  };
}

export function formatWindow(order: TrackedOrder, window: DayWindow) {
  return formatDateWindow(window, order.placedOn);
}

export function formatDay(date: Date, weekday = false) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(weekday ? { weekday: "short" } : {}),
  }).replace(",", "");
}

/** "Today, 06:12", "Yesterday, 21:40", "9 Oct, 14:05" */
export function formatWhen(date: Date, now: Date) {
  const time = date.toTimeString().slice(0, 5);
  const days = Math.round((midnight(now).getTime() - midnight(date).getTime()) / DAY_MS);
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  return `${formatDay(date)}, ${time}`;
}

/** "2 days ago", "today" — for maker updates. */
export function daysAgo(date: Date, now: Date) {
  const days = Math.round((midnight(now).getTime() - midnight(date).getTime()) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function isMadeToOrder(parcel: Parcel) {
  return parcel.lines.some((item) => item.product.delivery);
}

export function isCustom(parcel: Parcel) {
  return parcel.lines.some((item) => item.line.measurements);
}

