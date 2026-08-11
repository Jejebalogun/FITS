import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ShopHero from "@/components/ShopHero";
import CategoryGrid from "@/components/CategoryGrid";
import TrendingProducts from "@/components/TrendingProducts";
import ShopHowItWorks from "@/components/ShopHowItWorks";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shop — FITS",
  description:
    "Everything indigenous & handcrafted. Verified creators, direct from the workshop. Browse fashion, footwear, jewellery and more — every piece made to order.",
};

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main>
        <ShopHero />
        <CategoryGrid />

        <div className="bg-cream">
          <TrendingProducts />
        </div>

        <ShopHowItWorks />
      </main>
      <Footer />
    </>
  );
}
