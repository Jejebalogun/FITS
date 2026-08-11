import SectionHeading from "./SectionHeading";

type Creator = {
  name: string;
  craft: string;
  location: string;
  rating: string;
  orders: string;
  tone: "sand" | "sage";
};

const creators: Creator[] = [
  {
    name: "Tunde Ade",
    craft: "Footwear",
    location: "Mushin, Lagos",
    rating: "4.9",
    orders: "214 orders",
    tone: "sand",
  },
  {
    name: "Adaeze Okafor",
    craft: "Crochet",
    location: "Enugu",
    rating: "5.0",
    orders: "168 orders",
    tone: "sage",
  },
  {
    name: "Amara Mensah",
    craft: "Jewellery",
    location: "Accra",
    rating: "4.8",
    orders: "302 orders",
    tone: "sand",
  },
  {
    name: "Kwame Boateng",
    craft: "Leather",
    location: "Kumasi",
    rating: "4.9",
    orders: "141 orders",
    tone: "sage",
  },
];

export default function CreatorGrid() {
  return (
    <section className="container-page py-20">
      <SectionHeading
        index="06"
        label="Featured creators"
        title="Meet the makers"
        tone="light"
        link={{ label: "All creators", href: "#" }}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {creators.map((creator) => (
          <article
            key={creator.name}
            className="overflow-hidden rounded-2xl bg-forest-card transition-transform hover:-translate-y-1"
          >
            <div
              className={`h-56 ${
                creator.tone === "sand" ? "bg-sand" : "bg-sage"
              }`}
              aria-hidden
            />
            <div className="p-5">
              <h3 className="flex items-center gap-1.5 font-display text-lg text-cream">
                {creator.name}
                <span className="text-clay" aria-label="Verified creator">
                  ✦
                </span>
              </h3>
              <p className="mt-1 text-sm text-cream/60">
                {creator.craft} · {creator.location}
              </p>
              <p className="mt-2 text-sm text-cream/60">
                <span aria-hidden>★</span> {creator.rating} · {creator.orders}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
