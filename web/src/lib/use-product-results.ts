"use client";

import { useEffect, useMemo, useState } from "react";

import { useMarket } from "@/components/marketplace/MarketProvider";
import type { Product } from "@/data/marketplace";
import {
  applyFilters,
  emptyFilters,
  sortProducts,
  type Filters,
  type SortKey,
} from "@/lib/marketplace-filters";

export const PER_PAGE = 9;

export type Layout = "grid" | "list";

/** Filter, sort and page state for a list of pieces — category and search alike. */
export function useProductResults(products: Product[], defaultSort: SortKey) {
  const { market } = useMarket();

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSortState] = useState<SortKey>(defaultSort);
  const [layout, setLayout] = useState<Layout>("grid");
  const [page, setPage] = useState(1);

  const visible = useMemo(
    () => sortProducts(applyFilters(products, filters, market), sort),
    [products, filters, market, sort],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PER_PAGE));

  // A narrowed result set can leave the current page out of range.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  function update(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  function setSort(next: SortKey) {
    setSortState(next);
    setPage(1);
  }

  return {
    filters,
    update,
    clearAll: () => update(emptyFilters),
    sort,
    setSort,
    layout,
    setLayout,
    page,
    setPage,
    pageCount,
    visible,
    pageItems: visible.slice((page - 1) * PER_PAGE, page * PER_PAGE),
  };
}
