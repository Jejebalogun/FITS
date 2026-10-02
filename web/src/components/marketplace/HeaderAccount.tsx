"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { useSession } from "@/components/auth/SessionProvider";
import { useDismiss } from "@/lib/use-dismiss";

/**
 * The top-right corner of the marketplace header.
 *
 * Browsing never requires an account, so a signed-out visitor gets a way in
 * rather than a fake identity. Once signed in, the same corner becomes their
 * account — including the switch into the creator studio, since creator is a
 * privilege on this account and not a separate login.
 */
export default function HeaderAccount() {
  const { user, ready, signOut } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useDismiss(wrapper, open, close);

  // Until the stored session is read the server markup stands, which is the
  // signed-out view. Showing the links is the safe default either way.
  if (!ready || !user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="whitespace-nowrap text-sm font-medium text-cream hover:text-clay"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="whitespace-nowrap rounded-full bg-cream px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-white"
        >
          Join
        </Link>
      </div>
    );
  }

  function leave() {
    signOut();
    setOpen(false);
    router.push("/shop");
  }

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5"
      >
        <span className="hidden max-w-[14rem] truncate text-sm text-cream/75 lg:block">
          {user.email}
        </span>
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage font-semibold text-forest"
        >
          {user.email.charAt(0).toUpperCase()}
        </span>
        <span className="sr-only">Your account</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-white py-2 shadow-lg"
        >
          <p className="truncate px-4 pb-2 pt-1 text-sm text-forest/60">
            Signed in as{" "}
            <strong className="font-semibold text-forest">{user.email}</strong>
          </p>

          <div className="h-px bg-forest/10" />

          <MenuLink href="/account/orders" onNavigate={close}>
            Your orders
          </MenuLink>
          <MenuLink href="/account/wishlist" onNavigate={close}>
            Saved pieces
          </MenuLink>
          <MenuLink href="/account/settings" onNavigate={close}>
            Settings
          </MenuLink>

          <div className="h-px bg-forest/10" />

          {user.isCreator ? (
            <MenuLink href="/studio" onNavigate={close}>
              Creator studio
            </MenuLink>
          ) : (
            <MenuLink href="/creators" onNavigate={close}>
              Become a Creator
            </MenuLink>
          )}

          <div className="h-px bg-forest/10" />

          <button
            type="button"
            role="menuitem"
            onClick={leave}
            className="w-full px-4 py-2.5 text-left text-sm text-forest/80 transition-colors hover:bg-sand"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="block px-4 py-2.5 text-sm text-forest/80 transition-colors hover:bg-sand"
    >
      {children}
    </Link>
  );
}
