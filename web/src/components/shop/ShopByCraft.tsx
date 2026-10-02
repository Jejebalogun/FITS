import Link from "next/link";

import SectionHeader from "@/components/shop/SectionHeader";
import { categories } from "@/data/marketplace";

/** Tints standing in for the craft photography. */
const tones: Record<string, string> = {
  fashion: "bg-[#6E2434]",
  "beadwork-jewellery": "bg-[#C08B3E]",
  bags: "bg-[#8B5A2B]",
  footwear: "bg-[#5C4033]",
  "home-living": "bg-[#A9743F]",
  beauty: "bg-[#C2A878]",
};

const CRAFT_SLUGS = [
  "fashion",
  "beadwork-jewellery",
  "bags",
  "footwear",
  "home-living",
  "beauty",
];

export default function ShopByCraft() {
  const crafts = CRAFT_SLUGS.map((slug) =>
    categories.find((category) => category.slug === slug),
  ).filter((category): category is NonNullable<typeof category> =>
    Boolean(category),
  );

  return (
    <section className="mx-auto w-full max-w-[90rem] px-6 py-14">
      <SectionHeader
        title="Shop by craft"
        action={{ label: "All categories", href: "/category/new-in" }}
      />

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {crafts.map((craft) => (
          <li key={craft.slug}>
            <Link href={`/category/${craft.slug}`} className="group block">
              <span
                className={`block aspect-[4/3] overflow-hidden rounded-2xl transition-transform group-hover:-translate-y-1 ${
                  tones[craft.slug] ?? "bg-sand"
                }`}
              />
              <span className="mt-3 block font-semibold text-forest group-hover:text-clay">
                {craft.shortName ?? craft.name}
              </span>
              <span className="block text-sm text-forest/60">
                {craft.pieceCount.toLocaleString("en-GB")} pieces
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
