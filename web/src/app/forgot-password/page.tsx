import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password — FITS",
  description: "Send yourself a link to set a new FITS password.",
};

// The query string is read here rather than in the form, so the card arrives in
// the server HTML instead of waiting on JavaScript.
export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <AuthShell
      headline="It happens."
      subcopy="We will get you back in within a minute."
    >
      <ResetPasswordForm initialEmail={searchParams.email ?? ""} />
    </AuthShell>
  );
}
