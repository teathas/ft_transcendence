import type { Metadata } from "next";

import { getDict } from "@/i18n/server";

import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.onboarding.metaTitle,
    description: d.onboarding.metaDescription,
  };
}

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
