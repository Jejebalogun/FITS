import type { Metadata } from "next";

import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { MarketProvider } from "@/components/marketplace/MarketProvider";
import SearchResults from "@/components/marketplace/SearchResults";

type SearchPageProps = {
  searchParams: { q?: string; exact?: string };
};

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q?.trim();
  return {
    title: query ? `Results for “${query}” — FITS` : "Search — FITS",
    description:
      "Search pieces and creators across FITS. Delivery windows and the full price shown before you pay.",
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? "";
  const exact = searchParams.exact === "1";

  return (
    <MarketProvider>
      <MarketplaceHeader query={query} />
      {/* A new query starts fresh: filters, tab and page all reset. */}
      <SearchResults key={`${query}|${exact}`} query={query} exact={exact} />
    </MarketProvider>
  );
}
