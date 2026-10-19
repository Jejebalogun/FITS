"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "@/components/auth/SessionProvider";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { useShopper } from "@/components/marketplace/ShopperProvider";

const ITEMS = [
  { href: "/account/orders", label: "My purchases" },
  { href: "/account/wishlist", label: "Saved pieces" },
  // Who you follow is managed from the feed's sidebar for now.
  { href: "/feed", label: "Following" },
  { href: "/account/measurements", label: "My measurements" },
  { href: "/account/addresses", label: "Delivery addresses" },
  { href: "/account/payments", label: "Payments" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountNav({
  badge,
  fallbackName,
}: {
  badge?: number;
  /** The name on their latest order, when no address is saved. */
  fallbackName?: string;
}) {
  const pathname = usePathname();
  const { user } = useSession();
  const { market } = useMarket();
  const { addresses } = useShopper();

  const name =
    addresses.find((address) => address.isDefault)?.name ?? fallbackName ?? user?.email ?? "Guest";

  return (
    <nav aria-label="Your account" className="lg:w-64 lg:shrink-0">
      <p className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage font-semibold text-forest"
        >
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-forest">{name}</span>
          <span className="block text-sm text-forest/55">Ships to {market.placeName}</span>
        </span>
      </p>
      <ul className="mt-6 flex gap-1 overflow-x-auto lg:flex-col">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 transition-colors ${
                  active ? "bg-forest font-semibold text-cream" : "text-forest/80 hover:bg-sand/60"
                }`}
              >
                {item.label}
                {active && badge ? (
                  <span className="rounded-full bg-clay px-2 text-xs font-semibold text-cream">{badge}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
