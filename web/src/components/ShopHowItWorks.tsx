"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    number: "01",
    title: "Discover",
    body: "Browse curated picks and trending makers. Filter by location, price, material and ship-to region.",
  },
  {
    number: "02",
    title: "Order your way",
    body: "Choose your size or submit custom measurements, add colour notes, and check out securely.",
  },
  {
    number: "03",
    title: "Made & delivered",
    body: "The maker crafts and ships your piece. Track every milestone to your door.",
  },
];

export default function ShopHowItWorks() {
  return (
    <section className="container-page py-20">
      <SectionHeading
        index="03"
        label="How it works"
        title="Order in three simple steps"
        tone="light"
      />
      <InView
        viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.16 },
          },
        }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
              },
            }}
            className="rounded-2xl bg-forest-card/60 p-8"
          >
            <span className="font-display text-4xl text-clay">
              {step.number}
            </span>
            <h3 className="mt-4 font-display text-xl text-cream">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">
              {step.body}
            </p>
          </motion.div>
        ))}
      </InView>
    </section>
  );
}
