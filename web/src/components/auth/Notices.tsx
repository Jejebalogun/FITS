import Link from "next/link";

/** Shown when the browser reports no connection. Typed input is kept, not cleared. */
export function OfflineNotice() {
  return (
    <div
      role="status"
      className="mb-6 flex gap-3 rounded-2xl bg-clay-wash px-4 py-3.5 text-sm text-forest"
    >
      <span aria-hidden className="font-semibold text-clay-deep">
        !
      </span>
      <p>
        <strong className="font-semibold">You&rsquo;re offline.</strong> We kept
        what you typed — try again when your connection is back.
      </p>
    </div>
  );
}

/**
 * Carries the reason the visitor hit the wall — the piece they tried to save —
 * so sign-up reads as continuing a task rather than starting one.
 */
export function SavedItemNotice({ item }: { item: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3">
      {/* Tonal stand-in until the real product thumbnail is wired through. */}
      <span aria-hidden className="h-11 w-11 shrink-0 rounded-xl bg-sand" />
      <div>
        <p className="font-semibold text-forest">Save the {item}</p>
        <p className="text-sm text-forest/60">
          A free account keeps them in your list.
        </p>
      </div>
    </div>
  );
}

/**
 * Sign-up conflict. Rather than a bare "email taken" error, it offers the two
 * ways forward and promises the saved piece survives the detour.
 */
export function AccountExistsNotice({
  email,
  joined,
}: {
  email: string;
  joined: string;
}) {
  return (
    <div role="alert" className="mb-6 rounded-2xl bg-white p-4">
      <p className="font-semibold text-forest">You already have an account</p>
      <p className="mt-1 text-sm text-forest/70">
        {email} joined in {joined}. Log in and your saved piece comes with you.
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link
          href={`/login?email=${encodeURIComponent(email)}`}
          className="rounded-full bg-forest-deep px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest"
        >
          Log in instead
        </Link>
        <Link
          href={`/forgot-password?email=${encodeURIComponent(email)}`}
          className="rounded-full border-2 border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:border-forest"
        >
          Reset password
        </Link>
      </div>
    </div>
  );
}
