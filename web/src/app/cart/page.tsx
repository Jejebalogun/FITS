import type { Metadata } from "next";

import CartView from "@/components/marketplace/CartView";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";

export const metadata: Metadata = {
  title: "Your cart — FITS",
  description:
    "Every parcel priced in full — pieces, shipping and duty — before you pay.",
};

// Guest checkout exists, so the cart works without an account.
export default function CartPage() {
  return (
    <MarketProvider>
      <MarketplaceHeader showCategories={false} />
      <div className="min-h-screen bg-cream pb-24">
        <CartView />
      </div>
    </MarketProvider>
  );
}
