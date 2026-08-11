"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";

const pillars = [
  {
    number: "01",
    title: "Discover the authentic",
    body: "Verified indigenous makers only — vetted for identity and quality. No dropship, no mass production.",
  },
  {
    number: "02",
    title: "Connect maker to buyer",
    body: "Structured orders with size, colour and custom specs. Message directly — no phone numbers exchanged.",
  },
  {
    number: "03",
    title: "Deliver local to global",
    body: "Integrated logistics and escrow-held payments. Track end-to-end; pay in Naira or global currencies.",
  },
];

export default function WhyFits() {
  return (
    <section className="container-page py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow mb-3">03 / Why FITS</p>
          <h2 className="font-display text-3xl text-forest sm:text-4xl lg:text-5xl">
            Infrastructure African creatives always deserved
          </h2>
          <p className="mt-6 max-w-md text-forest/70">
            Not a clone of Etsy or Amazon. Not resellers of foreign goods. A
            trustworthy, pan-African home for authentic makers and the buyers
            who want them.
          </p>
        </div>

        <InView
          as="ol"
          viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.3 },
            },
          }}
          className="divide-y divide-forest/15 border-t border-forest"
        >
          {pillars.map((pillar, index) => (
            <motion.li
              key={pillar.number}
              variants={{
                hidden: { opacity: 0, x: index % 2 === 0 ? 60 : -60 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
              className="flex gap-6 py-6"
            >
              <span className="font-display text-xl text-clay">
                {pillar.number}
              </span>
              <div>
                <h3 className="font-display text-lg text-forest">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-forest/70">
                  {pillar.body}
                </p>
              </div>
            </motion.li>
          ))}
        </InView>
      </div>
    </section>
  );
}
