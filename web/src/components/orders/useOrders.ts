"use client";

import { useMemo } from "react";

import { useSession } from "@/components/auth/SessionProvider";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import { DEMO_ORDER_EMAIL } from "@/data/orders";
import { useToday } from "@/lib/delivery";
import { allOrders, effectiveStage, type TrackedOrder } from "@/lib/orders";

/** Orders placed on this device, plus the demo account's history when signed in as it. */
export function useOrders() {
  const shopper = useShopper();
  const { user, ready: sessionReady } = useSession();
  const now = useToday();

  const demo = user?.email === DEMO_ORDER_EMAIL;
  const orders = useMemo(
    () => (now ? allOrders(shopper.orders, demo, now) : []),
    [shopper.orders, demo, now],
  );

  function stageOf(order: TrackedOrder, slug: string) {
    return effectiveStage(order, slug, shopper.parcelUpdates[`${order.id}/${slug}`], now ?? new Date());
  }

  return {
    ready: shopper.ready && sessionReady && now !== null,
    now: now ?? new Date(),
    orders,
    stageOf,
    signedIn: Boolean(user),
    email: user?.email ?? null,
  };
}
