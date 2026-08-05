export default function AppPromo() {
  return (
    <section className="container-page py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">13 / Get the app</p>
          <h2 className="font-display text-3xl text-forest sm:text-4xl lg:text-5xl">
            Carry the marketplace in your pocket
          </h2>
          <p className="mt-5 max-w-md text-forest/70">
            Browse cached listings offline, order in three taps, and get push +
            SMS updates on every order milestone.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#"
              className="rounded-lg bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
            >
              App Store
            </a>
            <a
              href="#"
              className="rounded-lg bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
            >
              Google Play
            </a>
          </div>
        </div>

        {/* Phone mockups */}
        <div className="flex items-center justify-center gap-6 lg:justify-end">
          <div
            className="h-72 w-36 rounded-[2rem] border-4 border-forest bg-sand sm:h-80 sm:w-40"
            aria-hidden
          />
          <div
            className="mt-10 h-72 w-36 rounded-[2rem] border-4 border-forest bg-sage sm:h-80 sm:w-40"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
