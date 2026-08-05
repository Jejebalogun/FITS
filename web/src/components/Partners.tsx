const partners = [
  "Paystack",
  "Stripe",
  "GIG Logistics",
  "DHL",
  "Sendbox",
  "Smile ID",
];

export default function Partners() {
  return (
    <section className="container-page py-16">
      <p className="eyebrow mb-8 text-center">
        15 / Powered by trusted partners
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((partner) => (
          <li
            key={partner}
            className="rounded-xl bg-forest-card px-4 py-4 text-center text-sm font-semibold text-cream/90"
          >
            {partner}
          </li>
        ))}
      </ul>
    </section>
  );
}
