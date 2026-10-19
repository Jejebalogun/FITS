import type { CartLine } from "@/components/marketplace/ShopperProvider";
import { convert, type Market } from "@/data/markets";
import {
  creatorOf,
  getProduct,
  isOpenForOrders,
  type Creator,
  type Product,
} from "@/data/marketplace";
import { arrivalWindow, combineWindows, type DayWindow } from "@/lib/delivery";

/** Why a piece in the cart cannot be ordered right now. */
export type Blocker = "sold-out" | "not-open" | "no-delivery";

export type PricedLine = {
  line: CartLine;
  product: Product;
  blocker: Blocker | null;
  /** Unit price times quantity, in the market's currency. */
  amount: number;
};

/** One creator's pieces travel together, so they are priced and dated together. */
export type Parcel = {
  creator: Creator;
  lines: PricedLine[];
  /** In the market's currency; zero when nothing in it can be ordered. */
  shipping: number;
  /** Charged on parcels that cross a border. */
  duty: number;
  /** The parcel waits for its slowest piece. Null when nothing can be ordered. */
  arrives: DayWindow | null;
  orderable: boolean;
};

export type CartSummary = {
  parcels: Parcel[];
  /** Only what can be ordered counts toward the totals. */
  pieceCount: number;
  creatorCount: number;
  blockedCount: number;
  orderableParcels: number;
  pieces: number;
  shipping: number;
  duty: number;
  total: number;
  /** False when every parcel ships within the buyer's own country. */
  hasDuty: boolean;
};

export function blockerFor(product: Product, market: Market): Blocker | null {
  if (product.soldOut) return "sold-out";
  if (!isOpenForOrders(creatorOf(product))) return "not-open";
  if (!product.shipsTo.includes(market.code)) return "no-delivery";
  return null;
}

export function isDomestic(creator: Creator, market: Market) {
  return creator.country === market.country;
}

/** One parcel's shipping from this creator to the market, already converted. */
export function shippingFor(creator: Creator, market: Market) {
  return convert(
    isDomestic(creator, market)
      ? creator.shipping.domesticGBP
      : creator.shipping.internationalGBP,
    market,
  );
}

/** Pence for currencies priced in whole units; whole naira and cedis otherwise. */
function roundCharge(amount: number, market: Market) {
  return market.step > 1
    ? Math.round(amount)
    : Math.round(amount * 100) / 100;
}

export function priceCart(
  cart: CartLine[],
  market: Market,
  /**
   * For an order already placed: price every line as bought, even if the piece
   * has since sold out or stopped shipping here.
   */
  options: { asOrdered?: boolean } = {},
): CartSummary {
  const parcels: Parcel[] = [];

  for (const line of cart) {
    const product = getProduct(line.productId);
    // A piece delisted since it was added simply drops out.
    if (!product) continue;

    const creator = creatorOf(product);
    let parcel = parcels.find((item) => item.creator.slug === creator.slug);
    if (!parcel) {
      parcel = {
        creator,
        lines: [],
        shipping: 0,
        duty: 0,
        arrives: null,
        orderable: false,
      };
      parcels.push(parcel);
    }

    parcel.lines.push({
      line,
      product,
      blocker: options.asOrdered ? null : blockerFor(product, market),
      amount: convert(product.priceGBP, market) * line.qty,
    });
  }

  for (const parcel of parcels) {
    const orderable = parcel.lines.filter((item) => !item.blocker);
    parcel.orderable = orderable.length > 0;
    if (!parcel.orderable) continue;

    parcel.shipping = shippingFor(parcel.creator, market);
    parcel.arrives = combineWindows(
      orderable.map((item) => arrivalWindow(item.product, parcel.creator)),
    );

    if (!isDomestic(parcel.creator, market)) {
      const goods = orderable.reduce((sum, item) => sum + item.amount, 0);
      parcel.duty = roundCharge((goods + parcel.shipping) * market.dutyRate, market);
    }
  }

  const orderableLines = parcels.flatMap((parcel) =>
    parcel.lines.filter((item) => !item.blocker),
  );
  const pieces = orderableLines.reduce((sum, item) => sum + item.amount, 0);
  const shipping = parcels.reduce((sum, parcel) => sum + parcel.shipping, 0);
  const duty = roundCharge(
    parcels.reduce((sum, parcel) => sum + parcel.duty, 0),
    market,
  );

  return {
    parcels,
    pieceCount: orderableLines.reduce((sum, item) => sum + item.line.qty, 0),
    creatorCount: parcels.length,
    blockedCount: parcels.flatMap((parcel) =>
      parcel.lines.filter((item) => item.blocker),
    ).length,
    orderableParcels: parcels.filter((parcel) => parcel.orderable).length,
    pieces,
    shipping,
    duty,
    total: roundCharge(pieces + shipping + duty, market),
    hasDuty: parcels.some(
      (parcel) => parcel.orderable && !isDomestic(parcel.creator, market),
    ),
  };
}

/** "Nigeria, the UK and the US" */
export function listPlaces(places: string[]) {
  if (places.length <= 1) return places.join("");
  return `${places.slice(0, -1).join(", ")} and ${places[places.length - 1]}`;
}
