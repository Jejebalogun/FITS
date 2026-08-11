"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";

const sideArticles = [
  {
    category: "Lookbook",
    title: "Festive season, styled six ways",
    tone: "bg-sage",
  },
  {
    category: "Maker Diary",
    title: "A day in a Kumasi leather workshop",
    tone: "bg-sand",
  },
  {
    category: "Guide",
    title: "How to buy custom-made, sight unseen",
    tone: "bg-sage",
  },
];

const gridArticles = [
  { category: "Business", title: "From market stall to global orders", tone: "bg-sand" },
  { category: "Craft", title: "Beadwork techniques of the Akan", tone: "bg-sage" },
  { category: "Culture", title: "Aso-ebi: the fabric of belonging", tone: "bg-sand" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16 },
  },
};

export default function EditorialFeatured() {
  return (
    <section className="container-page py-20">
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        {/* Featured article */}
        <a
          href="#"
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
        </a>

        {/* Side articles */}
        <InView
          viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
          variants={staggerContainer}
          className="flex flex-col gap-6"
        >
          {sideArticles.map((article) => (
            <motion.a
              key={article.title}
              href="#"
              variants={itemVariants}
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
        </InView>
      </div>

      {/* Secondary article grid */}
      <InView
        viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
        variants={staggerContainer}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3"
      >
        {gridArticles.map((article) => (
          <motion.a
            key={article.title}
            href="#"
            variants={itemVariants}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className={`h-40 ${article.tone}`} aria-hidden />
            <div className="p-5">
              <p className="eyebrow mb-2 text-[10px]">{article.category}</p>
              <h3 className="font-semibold text-forest">{article.title}</h3>
            </div>
          </motion.a>
        ))}
      </InView>
    </section>
  );
}
