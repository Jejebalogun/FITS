import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageIntro from "@/components/PageIntro";
import CreatorGrid from "@/components/CreatorGrid";
import Spotlight from "@/components/Spotlight";
import CreatorCta from "@/components/CreatorCta";
import CreatorTestimonials from "@/components/CreatorTestimonials";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Creators — FITS",
  description:
    "The makers behind the pieces. Verified indigenous designers and artisans, reaching buyers from Lagos to London. Meet them — or join them.",
};

export default function CreatorsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageIntro
          eyebrow="For creators"
          title="The makers behind the pieces"
          description="Verified indigenous designers and artisans, reaching buyers from Lagos to London. Meet them — or join them."
          cta={{ label: "Start selling on FITS", href: "#" }}
        />
        <CreatorGrid />

        <Spotlight
          imageSide="left"
          imageCaption="Portrait · Tunde in workshop"
          pill="Creator Spotlight"
          heading="My work never used to leave Lagos."
          quote
          body="For six years Tunde made handcrafted leather shoes in Mushin, reaching only referrals and market stalls. On FITS he takes size-and-colour orders from buyers worldwide — and gets paid reliably."
          personName="Tunde Ade"
          personDetail="Footwear · Mushin, Lagos"
        />

        <CreatorCta />
        <CreatorTestimonials />
      </main>
      <Footer />
    </>
  );
}
