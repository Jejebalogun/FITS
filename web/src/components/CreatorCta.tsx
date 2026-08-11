"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";

const stats = [
  { value: "10 photos", detail: "per listing, auto-optimised" },
  { value: "0 upfront", detail: "commission only on sales" },
  { value: "MoMo & USD", detail: "local + international payouts" },
];

export default function CreatorCta() {
  return (
    <section id="become-a-creator" className="bg-clay">
      <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3 text-cream/80">14 / Become a creator</p>
          <h2 className="font-display text-3xl text-cream sm:text-4xl lg:text-5xl">
            Your craft deserves a global audience
          </h2>
          <p className="mt-5 max-w-md text-cream/90">
            List in minutes, receive structured orders with size and colour,
            set your own lead times, and get paid to your bank or mobile
            money. Keep more of what you earn.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-full bg-cream px-7 py-3.5 font-semibold text-clay transition-colors hover:bg-white"
          >
            Start selling on FITS
          </a>
        </div>

        <InView
          viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.3 },
            },
          }}
          className="flex flex-col gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              variants={{
                hidden: { opacity: 0, x: index % 2 === 0 ? 60 : -60 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
              className="rounded-2xl bg-cream/15 p-6 backdrop-blur-sm"
            >
              <p className="font-display text-2xl text-cream">{stat.value}</p>
              <p className="mt-1 text-sm text-cream/80">{stat.detail}</p>
            </motion.div>
          ))}
        </InView>
      </div>
    </section>
  );
}
