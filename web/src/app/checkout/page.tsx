import type { Metadata } from "next";

import CheckoutView from "@/components/checkout/CheckoutView";
import { MarketProvider } from "@/components/marketplace/MarketProvider";

export const metadata: Metadata = {
  title: "Checkout — FITS",
  description: "Delivery and payment. Your money is held until each piece arrives.",
};

// Guest checkout (Screen 7) and account checkout (Screen 10) share this route:
// signed-out buyers get the guest form on the delivery step, nothing else differs.
export default function CheckoutPage() {
  return (
    <MarketProvider>
      <CheckoutView />
    </MarketProvider>
  );
}
