export default function Newsletter() {
  return (
    <section className="container-page pb-20">
      <div className="rounded-3xl bg-forest-deep px-6 py-16 text-center sm:px-12">
        <p className="eyebrow mb-4">16 / Newsletter</p>
        <h2 className="font-display text-3xl text-cream sm:text-4xl">
          New drops, straight to your inbox
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream/70">
          Weekly creator spotlights, fresh collections and early access to
          limited pieces.
        </p>
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          action="#"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-full border border-cream/20 bg-transparent px-5 py-3 text-cream placeholder:text-cream/40 focus:border-clay focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-clay px-7 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
