import type { Metadata } from "next";

import DoneView from "@/components/checkout/DoneView";
import { MarketProvider } from "@/components/marketplace/MarketProvider";

export const metadata: Metadata = {
  title: "Order placed — FITS",
};

export default function CheckoutDonePage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <MarketProvider>
      <DoneView orderId={searchParams.order} />
    </MarketProvider>
  );
}
