"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderAccount from "@/components/marketplace/HeaderAccount";
import HeaderSearch from "@/components/marketplace/HeaderSearch";
import ShipToSelector from "@/components/marketplace/ShipToSelector";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import { categories, type CategorySlug } from "@/data/marketplace";

type MarketplaceHeaderProps = {
  activeCategory?: CategorySlug;
  /** Product and cart pages drop the category row, as the designs show. */
  showCategories?: boolean;
  /** Keeps the box filled on the results page. */
  query?: string;
};

export default function MarketplaceHeader({
  activeCategory,
  showCategories = true,
  query,
}: MarketplaceHeaderProps) {
  const { saved, cartCount } = useShopper();
  const pathname = usePathname();

  return (
    <header className="bg-forest-deep">
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-[90rem] items-center gap-6 px-6 py-4">
        <Link href="/" aria-label="FITS — home" className="shrink-0">
          <Image
            src="/logo.png"
            alt="FITS"
            width={85}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/feed", label: "Feed" },
          ].map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors hover:text-clay ${
                  active ? "font-semibold text-cream" : "font-medium text-cream/75"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Ship-to and search sit together on the right, as the designs show. */}
        <div className="ml-auto hidden lg:block">
          <ShipToSelector />
        </div>

        <HeaderSearch initialQuery={query} />

        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          <Link
            href="/creators"
            className="hidden whitespace-nowrap text-sm font-medium text-clay-soft hover:text-clay lg:block"
          >
            Become a Creator
          </Link>

          <span aria-hidden className="hidden h-6 w-px bg-cream/15 lg:block" />

          {/* Saving works without an account, so the saved list does too. */}
          <IconLink href="/account/wishlist" label="Saved pieces" count={saved.length}>
            <span className="text-lg text-clay">♥</span>
          </IconLink>

          {/* Guest checkout exists, so the cart is not gated on signing in. */}
          <IconLink href="/cart" label="Cart" count={cartCount} showZero>
            <BagIcon />
          </IconLink>

          <HeaderAccount />
        </div>
      </div>

      {/* Category row */}
      {showCategories && (
        <nav aria-label="Categories" className="border-b border-forest/10 bg-white">
          <div className="mx-auto flex w-full max-w-[90rem] items-center gap-7 overflow-x-auto px-6">
            {categories.map((category) => {
              const active = category.slug === activeCategory;
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-colors ${
                    active
                      ? "border-clay text-clay"
                      : "border-transparent text-forest hover:text-clay"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
            <Link
              href="/gift-cards"
              className="ml-auto whitespace-nowrap py-4 text-sm font-medium text-clay hover:text-clay-deep"
            >
              Gift cards
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function IconLink({
  href,
  label,
  count,
  showZero = false,
  children,
}: {
  href: string;
  label: string;
  count: number;
  showZero?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} aria-label={`${label}, ${count} items`} className="relative">
      {children}
      {(count > 0 || showZero) && (
        <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-cream">
          {count}
        </span>
      )}
    </Link>
  );
}

function BagIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-6 w-6 text-cream"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" strokeLinecap="round" />
    </svg>
  );
}
