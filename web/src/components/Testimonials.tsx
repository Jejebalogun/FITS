const secondaryQuotes = [
  {
    quote:
      "My crochet went from a WhatsApp side hustle to orders across three countries. FITS handles payments and shipping so I just create.",
    name: "Adaeze O.",
    role: "Creator, Enugu",
  },
  {
    quote:
      "Custom-sized shoes from Lagos felt risky until FITS. Payment held until delivery, tracked the whole way. Flawless.",
    name: "David M.",
    role: "Buyer, Toronto",
  },
];

export default function Testimonials() {
  return (
    <section className="container-page py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-4">10 / Testimonials</p>
        <p className="text-xl tracking-[0.3em] text-clay" aria-label="5 stars">
          ★★★★★
        </p>
        <blockquote className="mt-6">
          <p className="font-display text-2xl leading-snug text-cream sm:text-3xl">
            &ldquo;I found the exact Ankara my grandmother used to wear — made
            by hand in Abeokuta and shipped to London in ten days.&rdquo;
          </p>
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="h-11 w-11 rounded-full bg-clay" aria-hidden />
          <div className="text-left">
            <p className="font-semibold text-cream">Ngozi A.</p>
            <p className="text-sm text-cream/60">Buyer · London</p>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {secondaryQuotes.map((item) => (
          <figure
            key={item.name}
            className="rounded-2xl bg-forest-card p-7"
          >
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
