"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import Breadcrumb from "@/components/marketplace/Breadcrumb";
import { useMarket } from "@/components/marketplace/MarketProvider";
import Gallery from "@/components/marketplace/product/Gallery";
import MeasurementsPanel, {
  blankMeasurements,
  invalidFields,
  type MeasurementField,
} from "@/components/marketplace/product/MeasurementsPanel";
import SaveButton from "@/components/marketplace/SaveButton";
import {
  useShopper,
  type Measurements,
} from "@/components/marketplace/ShopperProvider";
import { formatAmount, formatMoney, getMarket, markets } from "@/data/markets";
import {
  creatorOf,
  getCategory,
  offersMeasurements,
  productsByCreator,
  sizesFor,
  type Product,
} from "@/data/marketplace";
import { blockerFor, isDomestic, listPlaces, shippingFor } from "@/lib/cart";
import { arrivalWindow, formatDateWindow, useToday } from "@/lib/delivery";
import { useDismiss } from "@/lib/use-dismiss";

const CUSTOM = "Custom";

const SIZE_GUIDE = [
  { size: "XS", bust: "31–32", waist: "24–25", hips: "34–35" },
  { size: "S", bust: "33–34", waist: "26–27", hips: "36–37" },
  { size: "M", bust: "35–36", waist: "28–29", hips: "38–39" },
  { size: "L", bust: "38–40", waist: "31–33", hips: "41–43" },
  { size: "XL", bust: "42–44", waist: "35–37", hips: "45–47" },
];

export default function ProductDetail({ product }: { product: Product }) {
  const { market, ready, setPickerOpen } = useMarket();
  const shopper = useShopper();
  const today = useToday();

  const creator = creatorOf(product);
  const category = getCategory(product.category);
  const sizes = sizesFor(product);
  const sizeOptions = offersMeasurements(product) ? [...sizes, CUSTOM] : sizes;
  const colours = product.colours ?? [];
  const blocker = blockerFor(product, market);

  const [size, setSize] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurements>(blankMeasurements);
  const [prefilled, setPrefilled] = useState(false);
  const [colour, setColour] = useState(0);
  const [note, setNote] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  const [sizeError, setSizeError] = useState(false);
  const [measureErrors, setMeasureErrors] = useState<MeasurementField[]>([]);
  const [added, setAdded] = useState(false);
  const [popover, setPopover] = useState(false);
  const sizesRef = useRef<HTMLDivElement>(null);

  // Saved measurements fill the form once, the first time storage is read.
  const filledFromProfile = useRef(false);
  useEffect(() => {
    if (!shopper.ready || filledFromProfile.current) return;
    filledFromProfile.current = true;
    if (shopper.measurements) {
      setMeasurements(shopper.measurements);
      setPrefilled(true);
    }
  }, [shopper.ready, shopper.measurements]);

  /** Any change to the choices means the button offers to add again. */
  function changed() {
    setAdded(false);
  }

  function chooseSize(option: string) {
    setSize(option);
    setSizeError(false);
    setMeasureErrors([]);
    changed();
  }

  function addToCart() {
    if (sizes.length > 0 && !size) {
      setSizeError(true);
      sizesRef.current?.querySelector("button")?.focus();
      return;
    }
    if (size === CUSTOM) {
      const invalid = invalidFields(measurements);
      if (invalid.length > 0) {
        setMeasureErrors(invalid);
        return;
      }
      shopper.saveMeasurements(measurements);
    }

    shopper.addToCart({
      productId: product.id,
      size: size === CUSTOM ? null : size,
      measurements: size === CUSTOM ? measurements : null,
      colour: colours[colour]?.name ?? null,
      note,
    });
    setAdded(true);
    setPopover(true);
  }

  const closePopover = useCallback(() => setPopover(false), []);

  // The creator's own currency, for a buyer abroad: "≈ ₦54,000".
  const homeMarket = markets.find((item) => item.country === creator.country);
  const choiceSummary = [
    size === CUSTOM ? "Custom measurements" : size ? `Size ${size}` : null,
    colours[colour]?.name,
  ]
    .filter(Boolean)
    .join(" · ");
  const arrives = today
    ? formatDateWindow(arrivalWindow(product, creator), today)
    : null;
  const similar = productsByCreator(creator.name).filter(
    (item) => item.id !== product.id && !item.soldOut,
  ).length;

  return (
    <div className="relative min-h-screen bg-cream pb-24">
      <div className="mx-auto w-full max-w-[90rem] px-6 pb-6 pt-7">
        <Breadcrumb
          items={[
            ...(category
              ? [{ label: category.name, href: `/category/${category.slug}` }]
              : []),
            { label: creator.name, href: `/creator/${creator.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      {popover && (
        <AddedToCart
          product={product}
          details={choiceSummary}
          arrives={arrives ? `Arrives in ${market.placeName} ${arrives}` : null}
          price={formatMoney(product.priceGBP, market)}
          cartCount={shopper.cartCount}
          onClose={closePopover}
        />
      )}

      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <Gallery product={product} />

        <div>
          {/* Who made it */}
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              aria-hidden
              className={`h-9 w-9 shrink-0 rounded-full ${creator.tone}`}
            />
            <Link
              href={`/creator/${creator.slug}`}
              className="font-semibold text-forest hover:text-clay"
            >
              {creator.name}
              {creator.verified && (
                <span className="text-moss" title="Verified creator">
                  {" "}
                  ✓
                </span>
              )}
            </Link>
            <span className="text-sm text-forest/60">
              {creator.city}, {creator.country} ·{" "}
              {creator.reviews > 0 ? (
                <>
                  <span aria-hidden className="text-forest/70">
                    ★
                  </span>{" "}
                  {creator.rating.toFixed(1)} ({creator.reviews})
                </>
              ) : (
                "new shop"
              )}
            </span>
          </p>

          <h1 className="mt-4 font-display text-4xl text-forest sm:text-5xl">
            {product.name}
          </h1>

          {/* Price, and what it costs to get here */}
          {ready ? (
            <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-4xl text-forest">
                {formatMoney(product.priceGBP, market)}
              </span>
              <span className="text-forest/60">
                {homeMarket && homeMarket.code !== market.code && (
                  <>≈ {formatMoney(product.priceGBP, homeMarket)} · </>
                )}
                {blocker === "no-delivery"
                  ? `no delivery to ${market.placeName}`
                  : isDomestic(creator, market)
                    ? `delivery within ${market.placeName} ${formatAmount(
                        shippingFor(creator, market),
                        market,
                      )}`
                    : `delivery to ${market.placeName} ${formatAmount(
                        shippingFor(creator, market),
                        market,
                      )}`}
              </span>
            </p>
          ) : (
            <div aria-hidden className="mt-5 h-9 w-56 rounded-full bg-sand/70" />
          )}

          {/* The committed window, or why there isn't one */}
          <div className="mt-6 min-h-[3.25rem] rounded-xl bg-forest-deep px-5 py-3.5 text-cream">
            {ready && (
              <p>
                {product.delivery ? "Made to order" : "Ready to ship"} ·{" "}
                {product.soldOut ? (
                  <strong className="font-display font-normal">sold out</strong>
                ) : blocker === "not-open" ? (
                  <strong className="font-display font-normal">
                    ordering opens soon
                  </strong>
                ) : blocker === "no-delivery" ? (
                  <strong className="font-display font-normal">
                    not available to {market.placeName}
                  </strong>
                ) : (
                  <>
                    arrives in {market.placeName}{" "}
                    {arrives && (
                      <strong className="font-display font-normal">{arrives}</strong>
                    )}
                  </>
                )}
              </p>
            )}
          </div>

          {/* Size */}
          {sizeOptions.length > 0 && (
            <section className="mt-7">
              <div className="flex items-center justify-between">
                <h2 id="size-label" className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest">
                  Size
                </h2>
                {sizes.length > 0 && product.category === "fashion" && (
                  <button
                    type="button"
                    onClick={() => setGuideOpen((open) => !open)}
                    aria-expanded={guideOpen}
                    className="text-sm font-medium text-clay underline hover:text-clay-deep"
                  >
                    Size guide
                  </button>
                )}
              </div>

              {guideOpen && <SizeGuide />}

              <div
                ref={sizesRef}
                role="radiogroup"
                aria-labelledby="size-label"
                className="mt-3 flex flex-wrap gap-3"
              >
                {sizeOptions.map((option) => {
                  const selected = size === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => chooseSize(option)}
                      className={`h-14 min-w-14 rounded-xl border px-4 font-semibold transition-colors ${
                        selected
                          ? "border-forest bg-forest text-cream"
                          : sizeError
                            ? "border-clay bg-white text-forest"
                            : "border-forest/15 bg-white text-forest hover:border-forest/50"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <p role="alert" className="mt-2 text-sm font-medium text-clay-deep">
                  Choose a size first
                  {offersMeasurements(product) && ", or Custom to give your measurements"}.
                </p>
              )}

              {size === CUSTOM && (
                <MeasurementsPanel
                  value={measurements}
                  onChange={(next) => {
                    setMeasurements(next);
                    setMeasureErrors([]);
                    changed();
                  }}
                  errors={measureErrors}
                  prefilled={prefilled}
                  creatorName={creator.shortName}
                />
              )}
            </section>
          )}

          {/* Colour */}
          {colours.length > 0 && (
            <section className="mt-7">
              <h2 id="colour-label" className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-forest">
                Colour · {colours[colour].name}
              </h2>
              <div
                role="radiogroup"
                aria-labelledby="colour-label"
                className="mt-3 flex gap-4"
              >
                {colours.map((option, index) => (
                  <button
                    key={option.name}
                    type="button"
                    role="radio"
                    aria-checked={colour === index}
                    aria-label={option.name}
                    onClick={() => {
                      setColour(index);
                      changed();
                    }}
                    style={{ backgroundColor: option.hex }}
                    className={`h-12 w-12 rounded-full transition-shadow ${
                      colour === index
                        ? "ring-2 ring-forest ring-offset-2 ring-offset-cream"
                        : "hover:ring-2 hover:ring-forest/30 hover:ring-offset-2 hover:ring-offset-cream"
                    }`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Note */}
          <section className="mt-7">
            <label htmlFor="creator-note" className="font-mono text-xs uppercase tracking-[0.25em]">
              <span className="font-bold text-forest">Note to {creator.shortName}</span>
              <span className="text-forest/50"> — optional</span>
            </label>
            <input
              id="creator-note"
              value={note}
              maxLength={200}
              onChange={(event) => {
                setNote(event.target.value);
                changed();
              }}
              placeholder="e.g. slightly longer sleeves"
              className="mt-3 w-full rounded-xl border border-forest/15 bg-white px-5 py-4 text-forest outline-none transition-colors placeholder:text-forest/40 focus:border-forest"
            />
          </section>

          {/* Why it can't be bought here */}
          {ready && blocker === "no-delivery" && !product.soldOut && (
            <div className="mt-6 rounded-xl border border-clay/40 bg-clay-wash/60 px-5 py-4 text-forest">
              <p>
                <strong className="font-semibold text-clay-deep">
                  {creator.shortName} doesn&rsquo;t send to {market.placeName} yet.
                </strong>{" "}
                {creator.shortName} ships to{" "}
                {listPlaces(product.shipsTo.map((code) => getMarket(code).placeName))}.{" "}
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setPickerOpen(true);
                  }}
                  className="font-medium text-clay underline hover:text-clay-deep"
                >
                  Change ship-to
                </button>{" "}
                or{" "}
                <button
                  type="button"
                  onClick={() => {
                    if (!shopper.isSaved(product.id)) shopper.toggleSaved(product.id);
                  }}
                  className="font-medium text-clay underline hover:text-clay-deep"
                >
                  {shopper.isSaved(product.id) ? "saved for later" : "save it for later"}
                </button>
                .
              </p>
            </div>
          )}
          {ready && blocker === "not-open" && (
            <div className="mt-6 rounded-xl border border-clay/40 bg-clay-wash/60 px-5 py-4 text-forest">
              <strong className="font-semibold text-clay-deep">
                {creator.shortName} is new and still being verified.
              </strong>{" "}
              You can save this now. Ordering opens once FITS confirms the shop,
              usually within a day.{" "}
              <Link
                href={`/creator/${creator.slug}`}
                className="font-medium text-clay underline hover:text-clay-deep"
              >
                Follow {creator.shortName}
              </Link>{" "}
              to be told when it does.
            </div>
          )}
          {product.soldOut && (
            <div className="mt-6 rounded-xl border border-clay/40 bg-clay-wash/60 px-5 py-4 text-forest">
              <strong className="font-semibold text-clay-deep">This one has sold.</strong>{" "}
              {similar > 0 ? (
                <>
                  {creator.shortName} has {similar} similar{" "}
                  {similar === 1 ? "piece" : "pieces"}.{" "}
                  <Link
                    href={`/creator/${creator.slug}`}
                    className="font-medium text-clay underline hover:text-clay-deep"
                  >
                    See the shop
                  </Link>
                </>
              ) : (
                "Save it and you will hear if it is made again."
              )}
            </div>
          )}

          {/* Buy */}
          <div className="mt-6 flex items-center gap-4">
            <BuyButton
              ready={ready}
              blocked={
                blocker === "sold-out"
                  ? "Sold out"
                  : blocker === "not-open"
                    ? "Ordering opens soon"
                    : blocker === "no-delivery"
                      ? `Can’t ship to ${market.placeName}`
                      : null
              }
              added={added}
              onClick={addToCart}
            />
            <SaveButton
              product={product}
              className="h-16 w-16 shrink-0 border border-forest/20 text-2xl"
            />
          </div>

          <p className="mt-4 text-sm text-forest/65">
            Your money is held by FITS until you confirm it arrived as described.
          </p>
        </div>
      </div>
    </div>
  );
}

function BuyButton({
  ready,
  blocked,
  added,
  onClick,
}: {
  ready: boolean;
  blocked: string | null;
  added: boolean;
  onClick: () => void;
}) {
  const base =
    "h-16 flex-1 rounded-full text-lg font-semibold transition-colors";

  if (ready && blocked) {
    return (
      <button type="button" disabled className={`${base} cursor-not-allowed bg-sand text-forest/45`}>
        {blocked}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!ready}
      className={`${base} ${
        added
          ? "bg-forest text-cream hover:bg-forest-deep"
          : "bg-clay text-cream hover:bg-clay-deep disabled:bg-clay/60"
      }`}
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}

function SizeGuide() {
  return (
    <table className="mt-3 w-full overflow-hidden rounded-xl bg-white text-left text-sm">
      <caption className="sr-only">Body measurements by size, in inches</caption>
      <thead className="bg-sand/60 text-forest">
        <tr>
          <th className="px-4 py-2 font-semibold">Size</th>
          <th className="px-4 py-2 font-semibold">Bust (in)</th>
          <th className="px-4 py-2 font-semibold">Waist (in)</th>
          <th className="px-4 py-2 font-semibold">Hips (in)</th>
        </tr>
      </thead>
      <tbody className="text-forest/75">
        {SIZE_GUIDE.map((row) => (
          <tr key={row.size} className="border-t border-forest/10">
            <th scope="row" className="px-4 py-2 font-semibold text-forest">
              {row.size}
            </th>
            <td className="px-4 py-2">{row.bust}</td>
            <td className="px-4 py-2">{row.waist}</td>
            <td className="px-4 py-2">{row.hips}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AddedToCart({
  product,
  details,
  arrives,
  price,
  cartCount,
  onClose,
}: {
  product: Product;
  details: string;
  arrives: string | null;
  price: string;
  cartCount: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, true, onClose);

  return (
    <div
      ref={ref}
      role="status"
      // Fixed, so it is in view wherever the buyer scrolled to reach the button.
      className="fixed right-6 top-20 z-50 w-[calc(100%-3rem)] max-w-[34rem] rounded-3xl border border-forest/10 bg-cream p-7 shadow-2xl"
    >
      <p className="flex items-center gap-3 text-lg font-semibold text-forest">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-sm text-cream"
        >
          ✓
        </span>
        Added to your cart
      </p>

      <div className="mt-4 flex gap-5">
        <span aria-hidden className={`h-32 w-24 shrink-0 rounded-xl ${product.tone}`} />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-forest">{product.name}</p>
          {details && <p className="mt-1 text-forest/65">{details}</p>}
          {arrives && <p className="text-forest/65">{arrives}</p>}
          <p className="mt-2 font-display text-lg text-forest">{price}</p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Link
          href="/cart"
          className="flex-1 rounded-full bg-clay py-3.5 text-center font-semibold text-cream transition-colors hover:bg-clay-deep"
        >
          View cart ({cartCount})
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full border border-forest/20 py-3.5 font-semibold text-forest transition-colors hover:border-forest/50"
        >
          Keep shopping
        </button>
      </div>
    </div>
  );
}
