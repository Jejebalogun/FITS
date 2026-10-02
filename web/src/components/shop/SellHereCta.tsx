import Link from "next/link";

/**
 * The persistent route into selling. Band 6 of the flow: becoming a creator
 * upgrades the account the visitor already has, so the copy says "upgraded",
 * not "sign up".
 */
export default function SellHereCta() {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-6 pb-16 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-clay px-8 py-9 sm:px-12">
        <div>
          <h2 className="font-display text-2xl text-cream sm:text-3xl">
            Make things? Sell them here.
          </h2>
          <p className="mt-2 max-w-xl text-cream/85">
            Your account, upgraded. Buyers across the world, paid upfront, held
            safe until delivery.
          </p>
        </div>

        <Link
          href="/creators"
          className="whitespace-nowrap rounded-full bg-cream px-7 py-3.5 font-semibold text-forest transition-colors hover:bg-white"
        >
          Become a Creator
        </Link>
      </div>
    </section>
  );
}
