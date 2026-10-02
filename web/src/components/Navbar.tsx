"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useSession } from "@/components/auth/SessionProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Creators", href: "/creators" },
  { label: "Collections", href: "/collections" },
  { label: "Editorial", href: "/editorial" },
  { label: "Regions", href: "/regions" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-forest/95 backdrop-blur">
      <div className="container-page">
        <nav
          className="flex items-center justify-between py-5"
          aria-label="Main navigation"
        >
          <a href="#home" className="flex items-center">
            <Image
              src="/logo.png"
              alt="FITS — Fashion Indigenous Trends & Styles"
              width={85}
              height={40}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm transition-colors hover:text-clay ${
                    pathname === link.href ? "text-clay" : "text-cream"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 lg:flex">
            {user ? (
              <a
                href="/shop"
                className="flex items-center gap-2 text-sm text-cream hover:text-clay"
              >
                <span
                  aria-hidden
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-xs font-semibold text-forest"
                >
                  {user.email.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[12rem] truncate">{user.email}</span>
              </a>
            ) : (
              <a href="/login" className="text-sm text-cream hover:text-clay">
                Sign in
              </a>
            )}
            <a
              href="#become-a-creator"
              className="rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay-deep"
            >
              Become a Creator
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-0.5 w-6 bg-cream transition-transform ${
                open ? "translate-y-1 rotate-45" : ""
              }`}
            />
            <span className={`h-0.5 w-6 bg-cream ${open ? "hidden" : ""}`} />
            <span
              className={`h-0.5 w-6 bg-cream transition-transform ${
                open ? "-translate-y-1 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-cream/10 pb-6 lg:hidden">
            <ul className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 hover:bg-forest-card ${
                      pathname === link.href ? "text-clay" : "text-cream"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-4 px-3">
              <a href={user ? "/shop" : "/login"} className="text-cream hover:text-clay">
                {user ? user.email : "Sign in"}
              </a>
              <a
                href="#become-a-creator"
                onClick={() => setOpen(false)}
                className="rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-cream hover:bg-clay-deep"
              >
                Become a Creator
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="container-page">
        <div className="h-px bg-cream/10" />
      </div>
    </header>
  );
}
