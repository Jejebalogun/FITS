import SectionHeading from "./SectionHeading";

const sideArticles = [
  { category: "Lookbook", title: "Festive season, styled six ways", tone: "bg-sage" },
  { category: "Maker Diary", title: "A day in a Kumasi leather workshop", tone: "bg-sand" },
  { category: "Guide", title: "How to buy custom-made, sight unseen", tone: "bg-sage" },
];

export default function Journal() {
  return (
    <section id="editorial" className="container-page py-20">
      <SectionHeading
        index="11"
        label="FITS Editorial"
        title="The journal"
        link={{ label: "Read more", href: "#editorial" }}
      />

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
        <div className="flex flex-col gap-6">
          {sideArticles.map((article) => (
            <a
              key={article.title}
              href="#"
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
