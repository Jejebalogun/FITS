const heroCards = [
  { tag: "Footwear · Lagos", tone: "bg-forest-card", height: "h-56 sm:h-64" },
  { tag: "Adire · Abeokuta", tone: "bg-clay", height: "h-64 sm:h-80" },
  { tag: "Jewellery · Accra", tone: "bg-forest-card", height: "h-56 sm:h-64" },
];

export default function Hero() {
  return (
    <section id="home" className="container-page pb-20 pt-16 sm:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-6">Fashion Indigenous Trends &amp; Styles</p>
        <h1 className="font-display text-4xl leading-tight sm:text-6xl lg:text-7xl">
          The home of African craft, worn worldwide.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-cream/80 sm:text-lg">
          From a Lagos workshop to a doorstep in London — discover, order and
          receive authentic indigenous fashion and craft, direct from the
          makers.
        </p>
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
