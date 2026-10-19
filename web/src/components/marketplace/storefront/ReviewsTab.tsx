import Link from "next/link";

import { getProduct, isOpenForOrders, type Creator } from "@/data/marketplace";
import { formatAgo, ratingBreakdowns, reviewsFor } from "@/data/storefronts";

const SCALE = 5;

function Stars({ value, className = "" }: { value: number; className?: string }) {
  const full = Math.round(value);
  return (
    <span className={`text-clay-soft ${className}`}>
      <span aria-hidden>
        {"★".repeat(full)}
        {"☆".repeat(SCALE - full)}
      </span>
      <span className="sr-only">{value} out of 5 stars</span>
    </span>
  );
}

export default function ReviewsTab({ creator }: { creator: Creator }) {
  const written = reviewsFor(creator.slug);
  const breakdown = ratingBreakdowns[creator.slug];

  if (creator.reviews === 0) {
    return (
      <p className="rounded-3xl bg-white px-8 py-10 text-forest/70">
        {isOpenForOrders(creator)
          ? `No reviews yet. ${creator.shortName}'s first orders are still on their way.`
          : `Reviews open once ${creator.shortName}'s shop is verified and the first orders arrive.`}{" "}
        Only buyers whose order was delivered can review, so every rating here is
        from a real purchase.
      </p>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
      <aside>
        <p className="font-display text-7xl text-forest">{creator.rating.toFixed(1)}</p>
        <Stars value={creator.rating} className="mt-2 block text-2xl" />
        <p className="mt-3 text-forest/65">
          {creator.reviews} reviews from verified purchases
        </p>

        {breakdown && (
          <dl className="mt-7 space-y-3.5">
            {breakdown.map((row) => (
              <div key={row.label} className="flex items-center gap-4">
                <dt className="w-36 shrink-0 text-forest">{row.label}</dt>
                <dd className="flex flex-1 items-center gap-4">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-forest/10">
                    <span
                      className="block h-full rounded-full bg-forest"
                      style={{ width: `${(row.score / SCALE) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-right font-semibold text-forest">
                    {row.score.toFixed(1)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </aside>

      <ul className="space-y-5">
        {written.map((review) => {
          const product = getProduct(review.productId);
          return (
            <li key={review.id}>
              <article className="flex gap-6 rounded-3xl bg-white p-7">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-forest">
                      {review.author} · {review.city}
                    </h3>
                    <p className="text-sm text-forest/55">{formatAgo(review.daysAgo)}</p>
                  </div>
                  <p className="mt-1.5 text-sm text-forest/70">
                    <Stars value={review.stars} className="text-base" />
                    {product && <> · {product.name}</>}
                  </p>
                  <p className="mt-3 text-forest/85">{review.text}</p>
                </div>
                {product && (
                  <Link
                    href={`/product/${product.id}`}
                    aria-label={product.name}
                    className={`hidden h-32 w-32 shrink-0 rounded-xl sm:block ${product.tone}`}
                  />
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
