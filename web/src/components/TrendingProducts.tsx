"use client";

import { motion } from "motion/react";
import { InView } from "./core/in-view";
import SectionHeading from "./SectionHeading";
import ProductCard, { type Product } from "./ProductCard";

const products: Product[] = [
  {
    name: "Adire Wrap Dress",
    maker: "Abeokuta Studio",
    rating: "4.9",
    price: "₦48,000",
    tone: "sand",
    trending: true,
  },
  {
    name: "Aso-oke Clutch",
    maker: "Amara Mensah",
    rating: "4.8",
    price: "₦22,500",
    tone: "sage",
  },
  {
    name: "Beaded Necklace",
    maker: "Amara Mensah",
    rating: "5.0",
    price: "₦15,000",
    tone: "sand",
  },
  {
    name: "Leather Mule Sandals",
    maker: "Tunde Ade",
    rating: "4.9",
    price: "₦36,000",
    tone: "sage",
  },
];

export default function TrendingProducts() {
  return (
    <section id="trending" className="container-page py-20">
      <SectionHeading
        index="05"
        label="Trending"
        title="Trending this week"
        link={{ label: "See all", href: "#trending" }}
      />
      <InView
        viewOptions={{ once: true, margin: "0px 0px -50% 0px" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.16 },
          },
        }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((product) => (
          <motion.div
            key={product.name}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
              },
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </InView>
    </section>
  );
}
