import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  cta?: { label: string; href: string };
};

export default function PageIntro({
  eyebrow,
  title,
  description,
  cta,
}: PageIntroProps) {
  return (
    <section className="container-page pb-16 pt-16 text-center sm:pt-24">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-6">{eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-cream/80 sm:text-lg">
          {description}
        </p>
        {cta && (
          <a
            href={cta.href}
            className="mt-8 inline-block rounded-full bg-clay px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  );
}
