import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageIntro from "@/components/PageIntro";
import CollectionsGrid from "@/components/CollectionsGrid";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Collections — FITS",
  description:
    "Pieces, grouped by story. Hand-picked edits across makers and regions — built around a craft, a season, or a moment.",
};

export default function CollectionsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageIntro
          eyebrow="Curated collections"
          title="Pieces, grouped by story"
          description="Hand-picked edits across makers and regions — built around a craft, a season, or a moment."
        />

        <div className="bg-cream">
          <CollectionsGrid />
        </div>

        <Testimonials secondary={false} />

        <Newsletter
          eyebrow="12 / Newsletter"
          title="New collections, straight to your inbox"
          description="Early access to limited drops and seasonal edits."
        />
      </main>
      <Footer />
    </>
  );
}
