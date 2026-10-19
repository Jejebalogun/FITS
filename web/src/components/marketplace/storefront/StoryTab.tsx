import type { Creator, Product } from "@/data/marketplace";
import { stories } from "@/data/storefronts";

export default function StoryTab({
  creator,
  products,
}: {
  creator: Creator;
  products: Product[];
}) {
  const story = stories[creator.slug];

  if (!story) {
    return (
      <p className="rounded-3xl bg-white px-8 py-10 text-forest/70">
        {creator.shortName} hasn&rsquo;t written a story yet. The pieces in the
        catalogue are the best introduction for now.
      </p>
    );
  }

  // Workshop photos once uploads exist; the pieces' tones stand in until then.
  const tiles = [creator.tone, ...products.map((product) => product.tone)];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-clay">
          In {creator.shortName}&rsquo;s words
        </p>
        <blockquote className="mt-4 font-display text-3xl leading-tight text-forest sm:text-4xl">
          &ldquo;{story.quote}&rdquo;
        </blockquote>
        <p className="mt-7 text-lg leading-relaxed text-forest/75">{story.body}</p>

        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {story.facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl bg-white px-6 py-5">
              <dd className="font-display text-3xl text-forest">{fact.value}</dd>
              <dt className="mt-1 text-forest/65">{fact.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div aria-hidden className="grid grid-cols-2 gap-5">
        <div className={`row-span-2 min-h-[24rem] rounded-3xl ${tiles[0]}`} />
        <div className={`aspect-[5/4] rounded-3xl ${tiles[1] ?? tiles[0]}`} />
        <div className={`aspect-[5/4] rounded-3xl ${tiles[2] ?? tiles[0]}`} />
      </div>
    </div>
  );
}
