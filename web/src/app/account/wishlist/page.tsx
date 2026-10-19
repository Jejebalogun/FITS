import type { Metadata } from "next";

import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";
import WishlistView from "@/components/marketplace/WishlistView";

export const metadata: Metadata = {
  title: "Saved pieces — FITS",
  description: "Pieces you have saved, and the lists you have grouped them into.",
};

export default function WishlistPage({
  searchParams,
}: {
  searchParams: { list?: string };
}) {
  return (
    <MarketProvider>
      <MarketplaceHeader showCategories={false} />
      <div className="min-h-screen bg-cream pb-24">
        <WishlistView initialList={searchParams.list} />
      </div>
    </MarketProvider>
  );
}
