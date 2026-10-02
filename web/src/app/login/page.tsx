import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in — FITS",
  description:
    "Log in to FITS to see your orders, saved pieces, measurements and messages.",
};

// The query string is read here rather than in the form, so the card arrives in
// the server HTML instead of waiting on JavaScript.
export default function LoginPage({
  searchParams,
}: {
  searchParams: { email?: string; next?: string };
}) {
  // Only same-site paths, so the parameter cannot bounce anyone off-site.
  const next =
    searchParams.next?.startsWith("/") && !searchParams.next.startsWith("//")
      ? searchParams.next
      : "/shop";

  return (
    <AuthShell
      headline="Good to see you again."
      subcopy="Your orders, saved pieces and measurements are where you left them."
    >
      <LoginForm initialEmail={searchParams.email ?? ""} next={next} />
    </AuthShell>
  );
}
