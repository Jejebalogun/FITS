"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How does buyer protection work?",
    answer:
      "Your payment is held securely and only released once you confirm delivery. If something goes wrong, our dispute resolution steps in.",
  },
  {
    question: "Can I order a custom size?",
    answer:
      "Yes — most makers accept custom measurements. Pick a size from the maker's size guide or submit your own measurements and notes at checkout.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. Makers ship worldwide through our logistics partners, with end-to-end tracking. International buyers can pay by card in USD or GBP.",
  },
  {
    question: "How do creators get paid?",
    answer:
      "Earnings are paid out automatically to your linked bank account or mobile money after the buyer confirms delivery — no upfront fees, commission only on sales.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow mb-3">17 / FAQ</p>
          <h2 className="font-display text-3xl text-forest sm:text-4xl lg:text-5xl">
            Questions, answered
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="rounded-2xl bg-white shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-display text-base text-forest sm:text-lg">
                    {faq.question}
                  </span>
                  <span className="text-xl text-clay" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-sm leading-relaxed text-forest/70">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
