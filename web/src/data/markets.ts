// The ship-to market drives prices, delivery copy and filter labels across the
// whole marketplace, so it lives in one place. Prices are held in GBP and
// converted; a real build would price per market rather than convert at render.

export type MarketCode = "GB" | "NG" | "GH" | "US";

export type Market = {
  code: MarketCode;
  /** Shown in the ship-to selector. */
  country: string;
  flag: string;
  currency: string;
  symbol: string;
  /** "GH₵ 510" reads better than "GH₵510"; "£27" does not. */
  spaceAfterSymbol: boolean;
  /** Name of the money, for the "prices in pounds" line. */
  moneyName: string;
  /** Takes an article where it needs one: "the UK", "Ghana". */
  placeName: string;
  /** Multiplier from GBP. */
  rate: number;
  /** Prices are rounded to this step, so converted figures look priced, not calculated. */
  step: number;
};

export const markets: Market[] = [
  {
    code: "GB",
    country: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    symbol: "£",
    spaceAfterSymbol: false,
    moneyName: "pounds",
    placeName: "the UK",
    rate: 1,
    step: 1,
  },
  {
    code: "NG",
    country: "Nigeria",
    flag: "🇳🇬",
    currency: "NGN",
    symbol: "₦",
    spaceAfterSymbol: false,
    moneyName: "naira",
    placeName: "Nigeria",
    rate: 2000,
    step: 500,
  },
  {
    code: "GH",
    country: "Ghana",
    flag: "🇬🇭",
    currency: "GHS",
    symbol: "GH₵",
    spaceAfterSymbol: true,
    moneyName: "cedis",
    placeName: "Ghana",
    rate: 18.9,
    step: 5,
  },
  {
    code: "US",
    country: "United States",
    flag: "🇺🇸",
    currency: "USD",
    symbol: "$",
    spaceAfterSymbol: false,
    moneyName: "dollars",
    placeName: "the US",
    rate: 1.27,
    step: 1,
  },
];

export const defaultMarket = markets[0];

export function getMarket(code: MarketCode) {
  return markets.find((market) => market.code === code) ?? defaultMarket;
}

export function convert(priceGBP: number, market: Market) {
  const raw = priceGBP * market.rate;
  return Math.round(raw / market.step) * market.step;
}

export function formatMoney(priceGBP: number, market: Market) {
  const amount = convert(priceGBP, market);
  const digits = amount.toLocaleString("en-GB");
  return market.spaceAfterSymbol
    ? `${market.symbol} ${digits}`
    : `${market.symbol}${digits}`;
}

/** Formats an already-converted figure, for the price filter's own inputs. */
export function formatAmount(amount: number, market: Market) {
  const digits = amount.toLocaleString("en-GB");
  return market.spaceAfterSymbol
    ? `${market.symbol} ${digits}`
    : `${market.symbol}${digits}`;
}
