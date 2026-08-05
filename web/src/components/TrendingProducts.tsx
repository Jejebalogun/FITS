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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}
