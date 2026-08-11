const quotes = [
  {
    quote:
      "My crochet went from a WhatsApp side hustle to orders across three countries. FITS handles payments and shipping so I just create.",
    name: "Adaeze O.",
    role: "Creator, Enugu",
  },
  {
    quote:
      "For years my work never left Lagos — just referrals and market stalls. On FITS I get paid reliably by buyers I'll never meet.",
    name: "Tunde A.",
    role: "Creator, Lagos",
  },
];

export default function CreatorTestimonials() {
  return (
    <section className="container-page py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-4">13 / Testimonials</p>
        <h2 className="font-display text-3xl text-cream sm:text-4xl">
          Loved by creators
        </h2>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {quotes.map((item) => (
          <figure key={item.name} className="rounded-2xl bg-forest-card p-7">
            <blockquote>
              <p className="leading-relaxed text-cream/85">
                &ldquo;{item.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold text-cream">{item.name}</span>
              <span className="text-cream/60"> · {item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
