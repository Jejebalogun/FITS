import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import WhyFits from "@/components/WhyFits";
import TrendingProducts from "@/components/TrendingProducts";
import HowItWorks from "@/components/HowItWorks";
import Collections from "@/components/Collections";
import Testimonials from "@/components/Testimonials";
import Journal from "@/components/Journal";
import AppPromo from "@/components/AppPromo";
import CreatorCta from "@/components/CreatorCta";
import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoryGrid />

        <div className="bg-cream">
          <WhyFits />
          <TrendingProducts />
          <HowItWorks />
          <Collections />
        </div>

        <Testimonials />

        <div className="bg-cream">
          <Journal />
          <AppPromo />
        </div>

        <CreatorCta />
        <Partners />
        <Newsletter />

        <div className="bg-cream">
          <Faq />
        </div>
      </main>
      <Footer />
    </>
  );
}
