"use client";

import { useEffect, useState } from "react";

const heroSlides = [
  {
    headline: "The home of African craft, worn worldwide.",
    paragraph:
      "From a Lagos workshop to a doorstep in London — discover, order and receive authentic indigenous fashion and craft, direct from the makers.",
  },
  {
    headline: "Handmade by artisans, shipped to your door.",
    paragraph:
      "Discover pieces made by independent African creators – sourced directly, shipped globally, and worn with pride.",
  },
  {
    headline: "Where heritage meets your everyday wardrobe.",
    paragraph:
      "Discover pieces made by independent African creators – sourced directly, shipped globally, and worn with pride.",
  },
  {
    headline: "From the continent to every closet on earth.",
    paragraph:
      "Discover pieces made by independent African creators – sourced directly, shipped globally, and worn with pride.",
  },
];

const heroCards = [
  { tag: "Footwear · Lagos", tone: "bg-forest-card", height: "h-56 sm:h-64" },
  { tag: "Adire · Abeokuta", tone: "bg-clay", height: "h-64 sm:h-80" },
  { tag: "Jewellery · Accra", tone: "bg-forest-card", height: "h-56 sm:h-64" },
];

const SLIDE_INTERVAL_MS = 5000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section id="home" className="container-page pb-20 pt-16 sm:pt-24">
      <div
        className="mx-auto max-w-3xl text-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <p className="eyebrow mb-6">Fashion Indigenous Trends &amp; Styles</p>

        {/* Headline crossfade */}
        <div className="grid">
          {heroSlides.map((slide, index) => (
            <h1
              key={slide.headline}
              className={`col-start-1 row-start-1 font-display text-4xl leading-tight transition-all duration-700 ease-in-out sm:text-6xl lg:text-7xl ${
                index === active
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 translate-y-3"
              }`}
              aria-hidden={index !== active}
            >
              {slide.headline}
            </h1>
          ))}
        </div>

        {/* Progress indicator */}
        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {heroSlides.map((slide, index) => (
            <button
              key={slide.headline}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                index === active
                  ? "w-8 bg-clay"
                  : "w-4 bg-cream/25 hover:bg-cream/40"
              }`}
            />
          ))}
        </div>

        {/* Paragraph crossfade */}
        <div className="mt-6 grid">
          {heroSlides.map((slide, index) => (
            <p
              key={slide.headline}
              className={`col-start-1 row-start-1 mx-auto max-w-xl text-cream/80 transition-all duration-700 ease-in-out sm:text-lg ${
                index === active
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 translate-y-3"
              }`}
              aria-hidden={index !== active}
            >
              {slide.paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#trending"
            className="rounded-full bg-clay px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            Shop the marketplace
          </a>
          <a
            href="#become-a-creator"
            className="rounded-full border border-cream/40 px-7 py-3.5 font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/5"
          >
            Become a Creator
          </a>
        </div>
      </div>

      {/* Showcase cards */}
      <div className="mt-16 grid grid-cols-1 items-end gap-6 sm:grid-cols-3">
        {heroCards.map((card) => (
          <div
            key={card.tag}
            className={`relative rounded-2xl ${card.tone} ${card.height}`}
          >
            <span className="absolute -bottom-3 left-5 rounded bg-cream px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-forest">
              {card.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
