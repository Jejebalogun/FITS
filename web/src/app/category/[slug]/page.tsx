import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryBrowser from "@/components/marketplace/CategoryBrowser";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";
import {
  categories,
  getCategory,
  productsForCategory,
} from "@/data/marketplace";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const category = getCategory(params.slug);
  if (!category) return { title: "Not found — FITS" };

  return {
    title: `${category.name} — FITS`,
    description: `Browse ${category.name.toLowerCase()} from verified African creators. Delivery windows and the full price shown before you pay.`,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  return (
    <MarketProvider>
      <MarketplaceHeader activeCategory={category.slug} cartCount={0} />
      <CategoryBrowser
        category={category}
        products={productsForCategory(category.slug)}
      />
    </MarketProvider>
  );
}
