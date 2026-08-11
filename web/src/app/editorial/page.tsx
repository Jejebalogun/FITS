import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageIntro from "@/components/PageIntro";
import EditorialFeatured from "@/components/EditorialFeatured";
import Spotlight from "@/components/Spotlight";
import ImpactStats from "@/components/ImpactStats";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Editorial — FITS",
  description:
    "Stories & lookbooks. Heritage features, maker diaries and seasonal lookbooks from across the continent.",
};

export default function EditorialPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageIntro
          eyebrow="FITS Editorial"
          title="Stories & lookbooks"
          description="Heritage features, maker diaries and seasonal lookbooks from across the continent."
        />

        <div className="bg-cream">
          <EditorialFeatured />
        </div>

        <Spotlight
          imageSide="right"
          imageCaption="Portrait · Tunde in workshop"
          pill="This week's story"
          heading="Six years in Mushin, one order at a time"
          body="For six years Tunde made handcrafted leather shoes in Mushin, reaching only referrals and market stalls. On FITS he takes size-and-colour orders from buyers worldwide."
          personName="Tunde Ade"
          personDetail="Footwear · Mushin, Lagos"
        />

        <ImpactStats />

        <Newsletter
          eyebrow="17 / Newsletter"
          title="The journal, in your inbox"
          description="New stories and lookbooks, once a week."
        />
      </main>
      <Footer />
    </>
  );
}
