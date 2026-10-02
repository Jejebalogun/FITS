"use client";

import Image from "next/image";
import Link from "next/link";

import HeaderAccount from "@/components/marketplace/HeaderAccount";
import ShipToSelector from "@/components/marketplace/ShipToSelector";
import { useSession } from "@/components/auth/SessionProvider";
import { categories, type CategorySlug } from "@/data/marketplace";

type MarketplaceHeaderProps = {
  activeCategory?: CategorySlug;
  savedCount?: number;
  cartCount?: number;
};

export default function MarketplaceHeader({
  activeCategory,
  savedCount = 0,
  cartCount = 0,
}: MarketplaceHeaderProps) {
  const { user } = useSession();

  // Saving a piece is what first asks a visitor for an account, so a signed-out
  // heart goes to sign-up rather than an empty list.
  const savedHref = user ? "/account/wishlist" : "/signup";

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
          <Link
            href="/shop"
            className="text-sm font-medium text-cream hover:text-clay"
          >
            Shop
          </Link>
          <Link
            href="/feed"
            className="text-sm font-medium text-cream hover:text-clay"
          >
            Feed
          </Link>
        </nav>

        <div className="hidden lg:block">
          <ShipToSelector />
        </div>

        <form
          role="search"
          className="relative hidden flex-1 md:block"
          onSubmit={(event) => event.preventDefault()}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/45"
          >
            ○
          </span>
          <input
            type="search"
            placeholder="Search pieces or creators"
            aria-label="Search pieces or creators"
            className="w-full rounded-full border border-cream/20 bg-forest px-11 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-cream/45 focus:border-cream/50"
          />
        </form>

        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/creators"
            className="hidden whitespace-nowrap text-sm font-medium text-clay-soft hover:text-clay lg:block"
          >
            Become a Creator
          </Link>

          <span aria-hidden className="hidden h-6 w-px bg-cream/15 lg:block" />

          <IconLink href={savedHref} label="Saved pieces" count={savedCount}>
            <span className="text-lg text-clay">♥</span>
          </IconLink>

          {/* Guest checkout exists, so the cart is not gated on signing in. */}
          <IconLink href="/cart" label="Cart" count={cartCount} showZero>
            <span className="text-lg text-cream">▣</span>
          </IconLink>

          <HeaderAccount />
        </div>
      </div>

      {/* Category row */}
      <nav
        aria-label="Categories"
        className="border-t border-cream/10"
      >
        <div className="mx-auto flex w-full max-w-[90rem] items-center gap-7 overflow-x-auto px-6">
          {categories.map((category) => {
            const active = category.slug === activeCategory;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap border-b-2 py-4 text-sm transition-colors ${
                  active
                    ? "border-clay text-clay"
                    : "border-transparent text-cream hover:text-clay"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
          <Link
            href="/gift-cards"
            className="ml-auto whitespace-nowrap py-4 text-sm text-clay-soft hover:text-clay"
          >
            Gift cards
          </Link>
        </div>
      </nav>
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
