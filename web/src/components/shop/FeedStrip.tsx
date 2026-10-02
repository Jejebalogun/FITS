import Link from "next/link";

import SectionHeader from "@/components/shop/SectionHeader";
import { feedClips } from "@/data/shop";

/**
 * Entry point to the shoppable feed. The swipe-to-cart gesture itself lives on
 * Screen 32; here the strip only promises it and sends people through.
 */
export default function FeedStrip() {
  return (
    <section className="bg-forest-deep py-16">
      <div className="mx-auto w-full max-w-[90rem] px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-clay">
              The feed
            </p>
            <div className="mt-3">
              <SectionHeader
                title="Watch it being made"
                sub="Swipe right on anything you like — it goes straight to your cart."
                onDark
              />
            </div>
          </div>

          <Link
            href="/feed"
            className="rounded-full border border-cream/40 px-6 py-3 font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
          >
            Open the feed
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {feedClips.map((clip) => (
            <li key={clip.id}>
              <Link href={`/feed?clip=${clip.id}`} className="group block">
                <span
                  className={`relative block aspect-[3/4] overflow-hidden rounded-2xl ${clip.tone}`}
                >
                  <span
                    aria-hidden
                    className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-forest-deep/70 text-xs text-cream"
                  >
                    ▶
                  </span>

                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/90 to-transparent p-3 pt-10">
                    <span className="block text-sm font-medium text-cream group-hover:text-clay-soft">
                      {clip.caption}
                    </span>
                    <span className="block text-xs text-cream/65">
                      {clip.creator} · {clip.length}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
