import type { Metadata } from "next";

import CreatorSpotlight from "@/components/shop/CreatorSpotlight";
import ExploreByCountry from "@/components/shop/ExploreByCountry";
import FeedStrip from "@/components/shop/FeedStrip";
import DiscoveryHero from "@/components/shop/DiscoveryHero";
import NewFromCreators from "@/components/shop/NewFromCreators";
import SellHereCta from "@/components/shop/SellHereCta";
import ShopByCraft from "@/components/shop/ShopByCraft";
import TrendingThisWeek from "@/components/shop/TrendingThisWeek";
import GeoBanner from "@/components/marketplace/GeoBanner";
import MarketplaceFooter from "@/components/marketplace/MarketplaceFooter";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";

export const metadata: Metadata = {
  title: "Shop — FITS",
  description:
    "Every piece made to order by a verified African creator. Delivery windows and the full price shown before you pay, money held until it arrives.",
};

// The Discovery Hub — the marketplace a visitor lands in from the marketing
// site. Everything below treats the visitor as a buyer, with a persistent
// route into selling.
export default function ShopPage() {
  return (
    <MarketProvider>
      <MarketplaceHeader />
      <GeoBanner />

      <main className="bg-cream">
        <DiscoveryHero />
        <ShopByCraft />
        <NewFromCreators />
        <TrendingThisWeek />
        <FeedStrip />
        <ExploreByCountry />
        <CreatorSpotlight />
        <SellHereCta />
      </main>

      <MarketplaceFooter />
    </MarketProvider>
  );
}
