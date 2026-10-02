import Link from "next/link";

import { heroCreator } from "@/data/shop";

export default function DiscoveryHero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep">
      {/* Tonal stand-in for the adire photograph. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#6E2434] via-[#4A2733] to-forest-deep"
      />
      {/* Scrim: heaviest on the left, where the words sit. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/70 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[90rem] px-6 py-20 sm:py-28">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-clay-soft">
            Made by hand, across Africa
          </p>

          <h1 className="mt-5 font-display text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-[3.4rem]">
            Adire, dyed by the woman who sells it to you.
          </h1>

          <p className="mt-5 max-w-md text-cream/80">
            Every piece is made to order by a verified creator. You pay when you
            order — they are paid when it reaches you.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/category/new-in"
              className="rounded-full bg-clay px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-clay-deep"
            >
              Shop the makers
            </Link>
            <Link
              href="/feed"
              className="flex items-center gap-2.5 rounded-full border border-cream/40 px-7 py-3.5 font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
            >
              <span aria-hidden>▶</span>
              Watch it being made
            </Link>
          </div>
        </div>

        {/* Creator credit — the hero names the maker, not just the product. */}
        <div className="mt-14 flex w-fit items-center gap-3 rounded-2xl bg-cream/95 px-4 py-3 lg:absolute lg:bottom-10 lg:right-6 lg:mt-0">
          <span aria-hidden className="h-10 w-10 shrink-0 rounded-full bg-sand" />
          <div className="text-sm">
            <p className="font-semibold text-forest">
              {heroCreator.name} · {heroCreator.country}
            </p>
            <p className="text-forest/60">
              {heroCreator.verified && "Verified · "}
              {heroCreator.delivered} pieces delivered
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
