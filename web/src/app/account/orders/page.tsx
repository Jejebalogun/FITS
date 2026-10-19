import type { Metadata } from "next";

import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";
import OrdersList from "@/components/orders/OrdersList";

export const metadata: Metadata = {
  title: "My purchases — FITS",
  description: "Every order, and where each piece has got to.",
};

export default function OrdersPage() {
  return (
    <MarketProvider>
      <MarketplaceHeader showCategories={false} />
      <div className="min-h-screen bg-cream pb-24">
        <OrdersList />
      </div>
    </MarketProvider>
  );
}
