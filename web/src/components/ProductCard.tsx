export type Product = {
  name: string;
  maker: string;
  rating: string;
  price: string;
  tone: "sand" | "sage";
  trending?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:-translate-y-1">
      <div
        className={`relative h-48 sm:h-52 ${
          product.tone === "sand" ? "bg-sand" : "bg-sage"
        }`}
      >
        {product.trending && (
          <span className="absolute left-3 top-3 rounded-full bg-clay px-3 py-1 text-xs font-semibold text-cream">
            Trending
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-forest">{product.name}</h3>
        <p className="mt-0.5 text-sm text-forest/60">
          {product.maker} · <span aria-hidden>★</span> {product.rating}
        </p>
        <p className="mt-3 font-semibold text-forest">{product.price}</p>
      </div>
    </article>
  );
}
