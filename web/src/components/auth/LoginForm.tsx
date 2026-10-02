"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import AuthButton from "@/components/auth/AuthButton";
import { Field, PasswordField } from "@/components/auth/Field";
import { useSession } from "@/components/auth/SessionProvider";
import { OfflineNotice } from "@/components/auth/Notices";
import SocialAuth from "@/components/auth/SocialAuth";
import { findAccount, pause } from "@/data/accounts";
import { emailError } from "@/lib/auth-validation";
import { useOnline } from "@/lib/use-online";

/** Sign-in pauses after this many failed attempts, as the error copy warns. */
const MAX_ATTEMPTS = 3;

export default function LoginForm({
  initialEmail = "",
  next = "/shop",
}: {
  initialEmail?: string;
  /** Where to return after signing in, so the header link brings you back. */
  next?: string;
}) {
  const router = useRouter();
  const { signIn } = useSession();
  const online = useOnline();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [attempts, setAttempts] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const lockedOut = attempts >= MAX_ATTEMPTS;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting || lockedOut) return;

    const nextErrors = {
      email: emailError(email) ?? undefined,
      password: password ? undefined : "Enter your password.",
    };
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    if (!online) return;

    setSubmitting(true);
    await pause();

    const account = findAccount(email);
    if (account && account.password === password) {
      // Band 2 of the flow: a signed-in buyer lands back in the marketplace.
      signIn(account.email);
      router.push(next);
      return;
    }

    const used = attempts + 1;
    setAttempts(used);
    setSubmitting(false);
    setPassword("");
    setErrors({
      password:
        used >= MAX_ATTEMPTS
          ? "Sign-in is paused for 15 minutes. Reset your password to get back in sooner."
          : `That password doesn${"’"}t match. ${
              MAX_ATTEMPTS - used
            } more ${
              MAX_ATTEMPTS - used === 1 ? "try" : "tries"
            }, then sign-in pauses for 15 minutes.`,
    });
  }

  const disabled = submitting || lockedOut;

  return (
    <div className="rounded-3xl bg-cream p-7 shadow-sm sm:p-9">
      <h1 className="font-display text-3xl text-forest-deep sm:text-[2rem]">
        Welcome back
      </h1>
      <p className="mt-2 text-forest/70">
        Log in to see your orders, saved pieces and messages.
      </p>

      <div className="mt-6">
        {!online && <OfflineNotice />}

        <SocialAuth disabled={disabled} />

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-forest/12" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest/45">
            or with email
          </span>
          <span className="h-px flex-1 bg-forest/12" />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            disabled={disabled}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <PasswordField
            className="mt-5"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            disabled={disabled}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
            action={
              <Link
                href={`/forgot-password${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                className="text-sm font-medium text-clay hover:text-clay-deep"
              >
                Forgot password?
              </Link>
            }
          />

          <AuthButton
            type="submit"
            className="mt-6"
            loading={submitting}
            loadingLabel="Logging you in"
            disabled={lockedOut}
          >
            {lockedOut ? "Sign-in paused" : "Log in"}
          </AuthButton>
        </form>

        <div className="mt-6 border-t border-forest/10 pt-5 text-center text-sm text-forest/70">
          New to FITS?{" "}
          <Link href="/signup" className="font-semibold text-forest hover:text-clay">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
