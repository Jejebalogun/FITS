import Link from "next/link";

import { spotlight } from "@/data/shop";

export default function CreatorSpotlight() {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-6 py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          aria-hidden
          className={`min-h-[18rem] rounded-3xl ${spotlight.tone}`}
        />

        <div className="flex flex-col justify-center rounded-3xl bg-sand p-8 sm:p-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-clay">
            {spotlight.eyebrow}
          </p>

          <h2 className="mt-4 font-display text-2xl leading-tight text-forest sm:text-3xl">
            {spotlight.headline}
          </h2>

          <p className="mt-4 text-forest/70">{spotlight.body}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={spotlight.storyHref}
              className="rounded-full bg-forest-deep px-6 py-3 font-semibold text-cream transition-colors hover:bg-forest"
            >
              Read her story
            </Link>
            <Link
              href={spotlight.shopHref}
              className="rounded-full border-2 border-forest/25 px-6 py-3 font-semibold text-forest transition-colors hover:border-forest"
            >
              Visit her shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
