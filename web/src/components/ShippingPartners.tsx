const partners = [
  "Paystack",
  "Stripe",
  "GIG Logistics",
  "DHL",
  "Sendbox",
  "Smile ID",
];

export default function ShippingPartners() {
  return (
    <section className="container-page py-20 text-center">
      <p className="eyebrow mb-4">Shipping &amp; payments</p>
      <h2 className="mx-auto max-w-xl font-display text-3xl leading-tight text-forest sm:text-4xl">
        Local to global, powered by trusted partners
      </h2>

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((partner) => (
          <li
            key={partner}
            className="rounded-full bg-white px-4 py-4 text-center text-sm font-semibold text-forest shadow-sm"
          >
            {partner}
          </li>
        ))}
      </ul>
    </section>
  );
}
