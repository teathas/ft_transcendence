import type { Metadata } from "next";

import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";

export const metadata: Metadata = {
  title: "Get started",
  description: "Set up your profile and open your first room.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
