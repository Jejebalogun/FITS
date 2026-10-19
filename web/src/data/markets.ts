// The ship-to market drives prices, delivery copy and filter labels across the
// whole marketplace, so it lives in one place. Prices are held in GBP and
// converted; a real build would price per market rather than convert at render.

export type MarketCode = "GB" | "NG" | "GH" | "US" | "CA";

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
  /**
   * Import duty and tax collected at checkout, as a share of pieces plus
   * shipping. Placeholder rates until a duty calculator is wired in.
   */
  dutyRate: number;
  /** Summary line for that charge: "UK import duty and VAT". */
  dutyLabel: string;
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
    dutyRate: 0.1,
    dutyLabel: "UK import duty and VAT",
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
    dutyRate: 0.2,
    dutyLabel: "Nigerian import duty",
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
    dutyRate: 0.2,
    dutyLabel: "Ghanaian import duty",
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
    dutyRate: 0.08,
    dutyLabel: "US import duty",
  },
  {
    code: "CA",
    country: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    symbol: "CA$",
    spaceAfterSymbol: false,
    moneyName: "Canadian dollars",
    placeName: "Canada",
    rate: 1.74,
    step: 1,
    dutyRate: 0.13,
    dutyLabel: "Canadian duty and GST",
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

/**
 * Formats an already-converted figure. Whole amounts drop the decimals ("£27"),
 * anything else shows two places ("£6.40").
 */
export function formatAmount(
  amount: number,
  market: Market,
  /** Always show pence, for a column of figures that must line up. */
  options: { cents?: boolean } = {},
) {
  const whole = Number.isInteger(amount) && !(options.cents && market.step <= 1);
  const digits = amount.toLocaleString("en-GB", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return market.spaceAfterSymbol
    ? `${market.symbol} ${digits}`
    : `${market.symbol}${digits}`;
}
