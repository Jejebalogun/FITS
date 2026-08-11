"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";
import SectionHeading from "./SectionHeading";

const sideArticles = [
  { category: "Lookbook", title: "Festive season, styled six ways", tone: "bg-sage" },
  { category: "Maker Diary", title: "A day in a Kumasi leather workshop", tone: "bg-sand" },
  { category: "Guide", title: "How to buy custom-made, sight unseen", tone: "bg-sage" },
];

const bounceTransition = { type: "spring" as const, duration: 1.1, bounce: 0.3 };

const featuredVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: bounceTransition },
};

const sideItemVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: bounceTransition },
};

export default function Journal() {
  return (
    <section id="editorial" className="container-page py-20">
      <SectionHeading
        index="11"
        label="FITS Editorial"
        title="The journal"
        link={{ label: "Read more", href: "#editorial" }}
      />

      <InView
        viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.35 } },
        }}
        className="grid gap-6 lg:grid-cols-[1.4fr,1fr]"
      >
        {/* Featured article */}
        <motion.a
          href="#"
          variants={featuredVariants}
          className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:-translate-y-1"
        >
          <div className="h-56 bg-sand sm:h-72" aria-hidden />
          <div className="p-7">
            <p className="eyebrow mb-3 text-[10px]">Heritage · Feature</p>
            <h3 className="font-display text-2xl text-forest">
              The 400-year story of Adire indigo
            </h3>
            <p className="mt-3 text-sm text-forest/70">
              How Abeokuta&rsquo;s dyers keep a Yoruba tradition alive — and
              bring it to a global audience.
            </p>
          </div>
        </motion.a>

        {/* Side articles */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.25 } },
          }}
          className="flex flex-col gap-6"
        >
          {sideArticles.map((article) => (
            <motion.a
              key={article.title}
              href="#"
              variants={sideItemVariants}
              className="group flex flex-1 items-center gap-5 rounded-2xl bg-white p-5 shadow-sm transition-transform hover:-translate-y-1"
            >
              <span
                className={`h-20 w-20 shrink-0 rounded-xl ${article.tone}`}
                aria-hidden
              />
              <span>
                <span className="eyebrow block text-[10px]">
                  {article.category}
                </span>
                <span className="mt-1.5 block font-semibold text-forest">
                  {article.title}
                </span>
              </span>
            </motion.a>
          ))}
        </motion.div>
      </InView>
    </section>
  );
}
