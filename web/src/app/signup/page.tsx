import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Join FITS",
  description:
    "Create a FITS account with an email and a password. Browse the feed, marketplace and creations straight away.",
};

// The query string is read here rather than in the form, so the card arrives in
// the server HTML instead of waiting on JavaScript.
export default function SignupPage({
  searchParams,
}: {
  searchParams: { save?: string };
}) {
  return (
    <AuthShell
      headline="Made to order, by the person who sells it."
      subcopy="3,180 pieces from 688 verified creators. Your money is held until it arrives."
    >
      <SignupForm savedItem={searchParams.save} />
    </AuthShell>
  );
}
