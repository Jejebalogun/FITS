import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";
import ProductDetail from "@/components/marketplace/product/ProductDetail";
import { getProduct, products } from "@/data/marketplace";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const product = getProduct(params.id);
  if (!product) return { title: "Not found — FITS" };

  return {
    title: `${product.name} by ${product.creator} — FITS`,
    description: `${product.name}, handmade by ${product.creator} in ${product.country}. Delivery window and the full price shown before you pay.`,
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  return (
    <MarketProvider>
      <MarketplaceHeader showCategories={false} />
      <ProductDetail product={product} />
    </MarketProvider>
  );
}
