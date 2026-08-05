import SectionHeading from "./SectionHeading";

type Category = {
  name: string;
  detail?: string;
  featured?: boolean;
  tall?: boolean;
};

const categories: Category[] = [
  { name: "Fashion & Clothing", detail: "Ankara · Adire · Aso-oke", featured: true, tall: true },
  { name: "Footwear" },
  { name: "Bags & Leather" },
  { name: "Jewellery", detail: "Beads · Rings · Accessories", tall: true },
  { name: "Crochet & Textile" },
  { name: "Home & Living" },
  { name: "Art & Collectibles" },
  { name: "Beauty & Wellness" },
];

export default function CategoryGrid() {
  return (
    <section id="categories" className="container-page py-20">
      <SectionHeading
        index="02"
        label="Categories"
        title="Shop by craft"
        tone="light"
        link={{ label: "All 8 categories", href: "#categories" }}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(3,minmax(7rem,auto))]">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href="#"
            className={`group flex flex-col justify-end rounded-2xl p-6 transition-transform hover:-translate-y-1 ${
              cat.featured
                ? "bg-clay"
                : "bg-forest-card hover:bg-forest-card/80"
            } ${cat.tall ? "min-h-48 lg:row-span-2 lg:min-h-0" : "min-h-28"}`}
          >
            <h3 className="font-display text-lg text-cream sm:text-xl">
              {cat.name}
            </h3>
            {cat.detail && (
              <p className="mt-1 text-sm text-cream/70">{cat.detail}</p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
