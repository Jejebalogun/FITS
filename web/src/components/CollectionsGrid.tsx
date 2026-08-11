"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";
import SectionHeading from "./SectionHeading";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CollectionsGrid() {
  return (
    <section className="container-page py-20">
      <SectionHeading
        index="08"
        label="All collections"
        title="Curated collections"
        link={{ label: "All collections", href: "#" }}
      />

      <InView
        viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.16 },
          },
        }}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Featured collection */}
          <motion.a
            href="#"
            variants={itemVariants}
            className="group flex min-h-72 flex-col justify-end rounded-2xl bg-forest-card p-7 transition-transform hover:-translate-y-1 lg:min-h-0"
          >
            <h3 className="font-display text-2xl text-cream sm:text-3xl">
              The Adire Revival
            </h3>
            <p className="mt-1 text-sm text-cream/60">
              48 pieces · hand-dyed indigo, Abeokuta
            </p>
          </motion.a>

          <div className="grid gap-5">
            <motion.a
              href="#"
              variants={itemVariants}
              className="group flex min-h-44 flex-col justify-end rounded-2xl bg-sand p-7 transition-transform hover:-translate-y-1"
            >
              <h3 className="font-display text-xl text-forest">
                Festive Aso-ebi
              </h3>
              <p className="mt-1 text-sm text-forest/60">32 pieces</p>
            </motion.a>
            <div className="grid gap-5 sm:grid-cols-2">
              <motion.a
                href="#"
                variants={itemVariants}
                className="group flex min-h-36 flex-col justify-end rounded-2xl bg-sage p-7 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-lg text-forest">
                  Everyday Leather
                </h3>
              </motion.a>
              <motion.a
                href="#"
                variants={itemVariants}
                className="group flex min-h-36 flex-col justify-end rounded-2xl bg-sand p-7 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-lg text-forest">
                  Beaded &amp; Bold
                </h3>
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <motion.a
            href="#"
            variants={itemVariants}
            className="group flex min-h-40 flex-col justify-end rounded-2xl bg-sage p-7 transition-transform hover:-translate-y-1"
          >
            <h3 className="font-display text-lg text-forest">
              Home Comforts
            </h3>
            <p className="mt-1 text-sm text-forest/60">19 pieces</p>
          </motion.a>
          <motion.a
            href="#"
            variants={itemVariants}
            className="group flex min-h-40 flex-col justify-end rounded-2xl bg-sand p-7 transition-transform hover:-translate-y-1"
          >
            <h3 className="font-display text-lg text-forest">
              Gifts Under ₦20k
            </h3>
            <p className="mt-1 text-sm text-forest/60">26 pieces</p>
          </motion.a>
        </div>
      </InView>
    </section>
  );
}
