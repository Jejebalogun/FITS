"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import AuthButton from "@/components/auth/AuthButton";
import { Field, PasswordField } from "@/components/auth/Field";
import {
  AccountExistsNotice,
  OfflineNotice,
  SavedItemNotice,
} from "@/components/auth/Notices";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { useSession } from "@/components/auth/SessionProvider";
import { findAccount, pause, type Account } from "@/data/accounts";
import { emailError, passwordError } from "@/lib/auth-validation";
import { useOnline } from "@/lib/use-online";

export default function SignupForm({
  savedItem,
}: {
  /** Set when the visitor arrived by trying to save a piece, e.g. ?save=waist beads */
  savedItem?: string;
}) {
  const router = useRouter();
  const { signIn } = useSession();
  const online = useOnline();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [existing, setExisting] = useState<Account | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // The button only lights up once both fields could plausibly be accepted —
  // the designs show it muted until then.
  const ready = !emailError(email) && !passwordError(password);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = {
      email: emailError(email) ?? undefined,
      password: passwordError(password) ?? undefined,
    };
    setErrors(nextErrors);
    setExisting(null);
    if (nextErrors.email || nextErrors.password) return;

    // Offline: keep everything typed and let the button become "Try again".
    if (!online) return;

    setSubmitting(true);
    await pause();

    const account = findAccount(email);
    if (account) {
      setExisting(account);
      setSubmitting(false);
      return;
    }

    // Screen 30 in the flow: the role question comes straight after sign-up,
    // carrying the address so that screen can name the account just created.
    signIn(email);
    router.push(
      `/onboarding/role?email=${encodeURIComponent(email.trim().toLowerCase())}`,
    );
  }

  return (
    <div className="rounded-3xl bg-cream p-7 shadow-sm sm:p-9">
      {!online && <OfflineNotice />}
      {savedItem && !existing && <SavedItemNotice item={savedItem} />}

      <h1 className="font-display text-3xl text-forest-deep sm:text-[2rem]">
        Join FITS
      </h1>
      <p className="mt-2 text-forest/70">
        Email and a password — that&rsquo;s all. We&rsquo;ll only ask for more
        when an order needs it.
      </p>

      {existing && (
        <div className="mt-6">
          <AccountExistsNotice email={existing.email} joined={existing.joined} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={submitting}
          error={errors.email}
          // The conflict card above already explains this one, so the field is
          // only marked, not captioned.
          invalid={Boolean(existing)}
          onChange={(event) => {
            setEmail(event.target.value);
            if (existing) setExisting(null);
            if (errors.email) {
              setErrors((previous) => ({ ...previous, email: undefined }));
            }
          }}
        />

        <PasswordField
          className="mt-5"
          autoComplete="new-password"
          placeholder="Choose a password"
          value={password}
          disabled={submitting}
          error={errors.password}
          hint={password ? undefined : "At least 8 characters, with a number."}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password) {
              setErrors((previous) => ({ ...previous, password: undefined }));
            }
          }}
        >
          {password && !errors.password && (
            <PasswordStrength password={password} />
          )}
        </PasswordField>

        <AuthButton
          type="submit"
          className="mt-6"
          loading={submitting}
          loadingLabel="Creating your account"
          disabled={!ready}
        >
          {online ? "Create account" : "Try again"}
        </AuthButton>
      </form>

      <p className="mt-3 text-center text-xs text-forest/55">
        By joining you agree to the{" "}
        <Link href="/terms" className="underline hover:text-forest">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-forest">
          Privacy Policy
        </Link>{" "}
        (NDPR).
      </p>

      <div className="mt-5 border-t border-forest/10 pt-5 text-center text-sm text-forest/70">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-forest hover:text-clay">
          Log in
        </Link>
      </div>
    </div>
  );
}
