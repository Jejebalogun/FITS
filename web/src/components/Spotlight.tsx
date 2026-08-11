type SpotlightProps = {
  imageSide?: "left" | "right";
  imageCaption: string;
  pill: string;
  heading: string;
  quote?: boolean;
  body: string;
  personName: string;
  personDetail: string;
};

export default function Spotlight({
  imageSide = "left",
  imageCaption,
  pill,
  heading,
  quote = false,
  body,
  personName,
  personDetail,
}: SpotlightProps) {
  const image = (
    <div className="relative min-h-[320px] bg-sand lg:min-h-[480px]">
      <span className="eyebrow absolute bottom-5 left-5 rounded bg-cream px-3 py-1.5 text-[10px] text-forest">
        {imageCaption}
      </span>
    </div>
  );

  const content = (
    <div className="flex flex-col justify-center bg-forest-deep px-6 py-16 sm:px-12 lg:px-16">
      <span className="mb-6 inline-block w-fit rounded-full bg-forest-card px-4 py-1.5 text-xs text-cream/80">
        {pill}
      </span>
      <h2 className="font-display text-3xl leading-snug text-cream sm:text-4xl">
        {quote ? `“${heading}”` : heading}
      </h2>
      <p className="mt-5 max-w-md text-cream/70">{body}</p>
      <div className="mt-8 flex items-center gap-3">
        <span className="h-11 w-11 rounded-full bg-clay" aria-hidden />
        <div>
          <p className="font-semibold text-cream">{personName}</p>
          <p className="text-sm text-cream/60">{personDetail}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="grid lg:grid-cols-2">
      {imageSide === "left" ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </section>
  );
}
