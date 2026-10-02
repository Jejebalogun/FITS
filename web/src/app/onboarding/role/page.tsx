import type { Metadata } from "next";

import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import RoleChooser from "@/components/onboarding/RoleChooser";

export const metadata: Metadata = {
  title: "How will you use FITS?",
  description:
    "Choose whether you are here to shop or to make and sell. It is the same account either way.",
};

// Screen 30 — Role Selection Onboarding. Shown immediately after sign-up,
// per Band 1 of the flow. The email comes through from the sign-up step.
export default function RoleSelectionPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <div className="min-h-screen bg-cream">
      <OnboardingHeader email={searchParams.email ?? "your account"} />
      <RoleChooser />
    </div>
  );
}
