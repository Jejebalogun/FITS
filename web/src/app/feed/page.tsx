import type { Metadata } from "next";

import FeedView from "@/components/marketplace/feed/FeedView";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";

export const metadata: Metadata = {
  title: "Your feed — FITS",
  description:
    "New pieces and making-of posts from the creators you follow, each one ready to save or order.",
};

export default function FeedPage() {
  return (
    <MarketProvider>
      <MarketplaceHeader showCategories={false} />
      <div className="min-h-screen bg-cream pb-24">
        <FeedView />
      </div>
    </MarketProvider>
  );
}
