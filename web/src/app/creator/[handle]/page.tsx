import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";
import Storefront from "@/components/marketplace/storefront/Storefront";
import { creators, getCreatorBySlug } from "@/data/marketplace";

export function generateStaticParams() {
  return creators.map((creator) => ({ handle: creator.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Metadata {
  const creator = getCreatorBySlug(params.handle);
  if (!creator) return { title: "Not found — FITS" };

  return {
    title: `${creator.name} — ${creator.craft} from ${creator.city} — FITS`,
    description: `${creator.craft} by ${creator.name} in ${creator.city}, ${creator.country}. Made to order, with the delivery window and full price shown before you pay.`,
  };
}

export default function CreatorPage({ params }: { params: { handle: string } }) {
  const creator = getCreatorBySlug(params.handle);
  if (!creator) notFound();

  return (
    <MarketProvider>
      <MarketplaceHeader showCategories={false} />
      <Storefront creator={creator} />
    </MarketProvider>
  );
}
