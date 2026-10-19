import { creatorOf, isOpenForOrders, type Product } from "@/data/marketplace";

/**
 * The committed delivery window, shown before purchase.
 *
 * The designs label the same number two ways: "Arrives in 12–14 days" on the
 * category page and "Made in 9 days" on the homepage. Those describe different
 * things — time to the door versus time at the bench — but there is only one
 * field behind them. Both modes read it until the product decides which the
 * creator actually commits to.
 */
export default function DeliveryBadge({
  product,
  mode = "arrives",
  className = "",
}: {
  product: Product;
  mode?: "arrives" | "made";
  className?: string;
}) {
  if (!isOpenForOrders(creatorOf(product))) {
    return (
      <span
        className={`rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-clay-deep ${className}`}
      >
        Not yet orderable
      </span>
    );
  }

  if (!product.delivery) {
    return (
      <span
        className={`rounded-full bg-sage px-3 py-1.5 text-xs font-medium text-forest ${className}`}
      >
        Ready to ship
      </span>
    );
  }

  const { minDays, maxDays } = product.delivery;
  const label =
    mode === "made"
      ? `Made in ${minDays} days`
      : `Arrives in ${
          minDays === maxDays ? minDays : `${minDays}–${maxDays}`
        } days`;

  return (
    <span
      className={`rounded-full bg-forest-deep/85 px-3 py-1.5 text-xs font-medium text-cream ${className}`}
    >
      {label}
    </span>
  );
}
