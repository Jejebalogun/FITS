"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import AuthButton from "@/components/auth/AuthButton";
import { Field } from "@/components/auth/Field";
import { OfflineNotice } from "@/components/auth/Notices";
import { pause } from "@/data/accounts";
import { emailError } from "@/lib/auth-validation";
import { useOnline } from "@/lib/use-online";

/** Seconds before the reset link can be sent again. */
const RESEND_SECONDS = 45;

export default function ResetPasswordForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const online = useOnline();

  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const problem = emailError(email);
    setError(problem);
    if (problem || !online) return;

    setSubmitting(true);
    await pause();
    // Always reports success, whether or not the address has an account.
    setSentTo(email.trim());
    setSubmitting(false);
  }

  if (sentTo) {
    return <CheckYourEmail email={sentTo} />;
  }

  return (
    <div className="rounded-3xl bg-cream p-7 shadow-sm sm:p-9">
      {!online && <OfflineNotice />}

      <h1 className="font-display text-3xl text-forest-deep sm:text-[2rem]">
        Reset your password
      </h1>
      <p className="mt-2 text-forest/70">
        Enter the email you joined with and we&rsquo;ll send a link to set a new
        password.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={submitting}
          error={error}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
        />

        <AuthButton
          type="submit"
          className="mt-6"
          loading={submitting}
          loadingLabel="Sending your link"
        >
          {online ? "Send reset link" : "Try again"}
        </AuthButton>
      </form>

      <div className="mt-6 border-t border-forest/10 pt-5 text-center text-sm text-forest/70">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-forest hover:text-clay">
          Log in
        </Link>
      </div>
    </div>
  );
}

function CheckYourEmail({ email }: { email: string }) {
  const [remaining, setRemaining] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (remaining === 0) return;
    const id = setInterval(() => {
      setRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const clock = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(
    2,
    "0",
  )}`;

  return (
    <div className="rounded-3xl bg-cream p-7 text-center shadow-sm sm:p-9">
      <span
        aria-hidden
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="2.5"
            y="5"
            width="19"
            height="14"
            rx="2.5"
            stroke="#1E3E33"
            strokeWidth="1.6"
          />
          <path
            d="m3.5 7 8.5 6 8.5-6"
            stroke="#1E3E33"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <h1 className="mt-5 font-display text-3xl text-forest-deep sm:text-[2rem]">
        Check your email
      </h1>
      <p className="mt-2 text-forest/70">
        We sent a reset link to
        <br />
        <strong className="font-semibold text-forest">{email}</strong>
      </p>

      <p className="mt-5 rounded-2xl bg-white px-4 py-3.5 text-left text-sm text-forest/75">
        The link works once and lasts an hour. Not there? Check spam or
        Promotions — it comes from{" "}
        <strong className="font-semibold text-forest">hello@fits.ng</strong>.
      </p>

      <Link
        href="/login"
        className="mt-5 flex w-full items-center justify-center rounded-full border-2 border-forest px-6 py-4 font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
      >
        Back to log in
      </Link>

      <p className="mt-4 text-sm text-forest/60" aria-live="polite">
        Didn&rsquo;t arrive?{" "}
        {remaining > 0 ? (
          <span>Resend in {clock}</span>
        ) : (
          <button
            type="button"
            onClick={() => setRemaining(RESEND_SECONDS)}
            className="font-semibold text-clay hover:text-clay-deep"
          >
            Resend the link
          </button>
        )}
      </p>
    </div>
  );
}
