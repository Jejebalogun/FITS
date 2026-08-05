import SectionHeading from "./SectionHeading";

const steps = [
  {
    number: "01",
    title: "Discover",
    body: "Browse curated picks and trending makers. Filter by location, price, material and ship-to region.",
    tone: "bg-sand",
  },
  {
    number: "02",
    title: "Order your way",
    body: "Pick a size or submit custom measurements, add colour notes, and check out securely in under three minutes.",
    tone: "bg-sage",
  },
  {
    number: "03",
    title: "Made & delivered",
    body: "The maker crafts and ships your piece. Track milestones, then confirm delivery to release payment.",
    tone: "bg-sand",
  },
];

export default function HowItWorks() {
  return (
    <section className="container-page py-20">
      <SectionHeading
        index="07"
        label="How it works"
        title="Three steps, start to doorstep"
      />
      <ol className="space-y-5">
        {steps.map((step) => (
          <li
            key={step.number}
            className="grid items-center gap-6 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-[auto,1fr] lg:grid-cols-[auto,1.2fr,1fr] lg:p-8"
          >
            <span className="font-display text-4xl text-clay sm:text-5xl">
              {step.number}
            </span>
            <div>
              <h3 className="font-display text-xl text-forest">{step.title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-forest/70">
                {step.body}
              </p>
            </div>
            <div
              className={`hidden h-28 rounded-xl lg:block ${step.tone}`}
              aria-hidden
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
