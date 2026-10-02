import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  /** Headline set over the artwork on the left panel. */
  headline: string;
  subcopy: string;
  /**
   * Path to the panel photograph. Until art direction lands the panel falls back
   * to a tonal placeholder, matching how the rest of the site stands in for imagery.
   */
  image?: string;
  children: ReactNode;
};

export default function AuthShell({
  headline,
  subcopy,
  image,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-sand">
      {/* Left: brand panel. Hidden on small screens, where the card takes the full width. */}
      <aside className="relative hidden w-[42%] shrink-0 overflow-hidden bg-forest lg:block">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="42vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-forest-card via-forest to-forest-deep" />
        )}
        {/* Scrim keeps the headline legible whatever the photograph is. */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-forest-deep/40" />

        <div className="relative flex h-full flex-col justify-between p-10">
          <Link href="/" aria-label="FITS — home">
            <Image
              src="/logo.png"
              alt="FITS"
              width={85}
              height={40}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <div className="max-w-md">
            <h2 className="font-display text-4xl leading-tight text-cream xl:text-5xl">
              {headline}
            </h2>
            <p className="mt-4 text-cream/80">{subcopy}</p>
          </div>
        </div>
      </aside>

      {/* Right: the form itself. */}
      <main className="relative flex flex-1 flex-col px-5 py-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-forest/80 transition-colors hover:text-forest"
        >
          <span aria-hidden>&larr;</span> Back to shopping
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[26rem]">{children}</div>
        </div>
      </main>
    </div>
  );
}
