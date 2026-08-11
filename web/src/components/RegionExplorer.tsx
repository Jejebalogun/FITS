"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";

const filters = [
  "Lagos",
  "Abeokuta",
  "Kano",
  "Enugu",
  "Accra",
  "Addis Ababa",
  "Nairobi",
];

const regions = [
  { name: "Lagos", detail: "2,140 makers · Nigeria", active: true },
  { name: "Abeokuta", detail: "Home of Adire · Nigeria" },
  { name: "Kano", detail: "Leather & weaving · Nigeria" },
  { name: "Enugu", detail: "Crochet & textile · Nigeria" },
  { name: "Accra", detail: "Jewellery & beads · Ghana" },
  { name: "Addis Ababa", detail: "Handwoven cotton · Ethiopia" },
];

export default function RegionExplorer() {
  return (
    <section className="container-page pb-20">
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              filter === "Lagos"
                ? "bg-clay text-cream"
                : "bg-forest-card text-cream/80 hover:bg-forest-card/70"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

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
        {regions.map((region) => (
          <motion.a
            key={region.name}
            href="#"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
              },
            }}
            className={`group flex min-h-[280px] flex-col justify-end rounded-2xl p-6 transition-transform hover:-translate-y-1 ${
              region.active ? "bg-clay" : "bg-forest-card hover:bg-forest-card/80"
            }`}
          >
            <h3 className="font-display text-2xl text-cream">
              {region.name}
            </h3>
            <p className="mt-1 text-sm text-cream/70">{region.detail}</p>
          </motion.a>
        ))}
      </InView>
    </section>
  );
}
