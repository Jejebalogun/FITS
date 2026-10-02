import Image from "next/image";
import Link from "next/link";

/**
 * Minimal chrome for the onboarding step — no nav, so the only thing to do is
 * answer the question. It names the account so the person knows which one they
 * just created.
 */
export default function OnboardingHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-forest/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" aria-label="FITS — home">
          {/*
            logo.png has a dark background baked in, so it cannot sit directly on
            cream the way the design draws it. The tile keeps it deliberate until
            a dark-on-transparent mark exists.
          */}
          <span className="inline-flex items-center rounded-xl bg-forest-deep px-3 py-1.5">
            <Image
              src="/logo.png"
              alt="FITS"
              width={85}
              height={40}
              priority
              className="h-6 w-auto"
            />
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-forest/65 sm:block">
            Signed in as{" "}
            <strong className="font-semibold text-forest">{email}</strong>
          </p>
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sage font-semibold text-forest"
          >
            {email.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}
