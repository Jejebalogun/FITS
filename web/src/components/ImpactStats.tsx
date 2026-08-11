const stats = [
  { value: "$31B", label: "African fashion market by 2030" },
  { value: "$2.6T", label: "Addressable spend incl. diaspora" },
  { value: "70%", label: "Of artisans have no online presence" },
  { value: "40%+", label: "Growth in NG creative exports / 5 yrs" },
];

export default function ImpactStats() {
  return (
    <section className="container-page py-24 text-center">
      <p className="eyebrow mb-4">The opportunity</p>
      <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
        A creative economy the world has never reached
      </h2>

      <div className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-4xl text-clay sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-cream/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
