import type { Metadata } from "next";

import { getDict } from "@/i18n/server";

import { ClassroomSection } from "@/features/landing/components/classroom-section";
import { FeatureGrid } from "@/features/landing/components/feature-grid";
import { FinalCta } from "@/features/landing/components/final-cta";
import { Hero } from "@/features/landing/components/hero";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { RoomShowcase } from "@/features/landing/components/room-showcase";
import { UseCases } from "@/features/landing/components/use-cases";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    // The landing page is the brand, so its title is absolute rather than
    // running through the "%s | Shared Room" template.
    title: {
      absolute: `${d.common.appName} — ${d.landing.hero.titleLead} ${d.landing.hero.titleAccent}`,
    },
    description: d.common.description,
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <ClassroomSection />
      <RoomShowcase />
      <HowItWorks />
      <UseCases />
      <FinalCta />
    </>
  );
}
