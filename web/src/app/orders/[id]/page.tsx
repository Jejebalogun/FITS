import type { Metadata } from "next";

import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";
import OrderDetail from "@/components/orders/OrderDetail";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { title: `Order ${params.id} — FITS` };
}

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <MarketProvider>
      <MarketplaceHeader showCategories={false} />
      <div className="min-h-screen bg-cream pb-24">
        <OrderDetail orderId={params.id} />
      </div>
    </MarketProvider>
  );
}
