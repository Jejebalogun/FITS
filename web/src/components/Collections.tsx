import SectionHeading from "./SectionHeading";

export default function Collections() {
  return (
    <section id="collections" className="container-page py-20">
      <SectionHeading
        index="09"
        label="Collections"
        title="Curated collections"
        link={{ label: "All collections", href: "#collections" }}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Featured collection */}
        <a
          href="#"
          className="group flex min-h-72 flex-col justify-end rounded-2xl bg-sage p-7 transition-transform hover:-translate-y-1 lg:min-h-0"
        >
          <h3 className="font-display text-2xl text-forest sm:text-3xl">
            The Adire Revival
          </h3>
          <p className="mt-1 text-sm text-forest/60">
            48 pieces · hand-dyed indigo, Abeokuta
          </p>
        </a>

        <div className="grid gap-5">
          <a
            href="#"
            className="group flex min-h-44 flex-col justify-end rounded-2xl bg-sand p-7 transition-transform hover:-translate-y-1"
          >
            <h3 className="font-display text-xl text-forest">
              Festive Aso-ebi
            </h3>
            <p className="mt-1 text-sm text-forest/60">32 pieces</p>
          </a>
          <div className="grid gap-5 sm:grid-cols-2">
            <a
              href="#"
              className="group flex min-h-36 flex-col justify-end rounded-2xl bg-sand p-7 transition-transform hover:-translate-y-1"
            >
              <h3 className="font-display text-lg text-forest">
                Everyday Leather
              </h3>
            </a>
            <a
              href="#"
              className="group flex min-h-36 flex-col justify-end rounded-2xl bg-sage p-7 transition-transform hover:-translate-y-1"
            >
              <h3 className="font-display text-lg text-forest">
                Beaded & Bold
              </h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
