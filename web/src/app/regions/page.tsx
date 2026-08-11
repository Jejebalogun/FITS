import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageIntro from "@/components/PageIntro";
import RegionExplorer from "@/components/RegionExplorer";
import ShippingPartners from "@/components/ShippingPartners";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Regions — FITS",
  description:
    "From every corner of the continent. Every region has its own craft tradition. Discover pieces rooted in the place they're made.",
};

export default function RegionsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageIntro
          eyebrow="Explore by region"
          title="From every corner of the continent"
          description="Every region has its own craft tradition. Discover pieces rooted in the place they're made."
        />

        <RegionExplorer />

        <div className="bg-cream">
          <ShippingPartners />
        </div>

        <Newsletter
          eyebrow="18 / Newsletter"
          title="New regions, new makers"
          description="Be first to know as we onboard new regions and creators."
        />
      </main>
      <Footer />
    </>
  );
}
