import type { Metadata } from "next";

import { ClassroomSection } from "@/features/landing/components/classroom-section";
import { FeatureGrid } from "@/features/landing/components/feature-grid";
import { FinalCta } from "@/features/landing/components/final-cta";
import { Hero } from "@/features/landing/components/hero";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { RoomShowcase } from "@/features/landing/components/room-showcase";
import { UseCases } from "@/features/landing/components/use-cases";

export const metadata: Metadata = {
  title: "Shared Room — Learn together. Write together.",
  description:
    "A real-time collaborative classroom where everyone can write, draw, chat and share files in the same room.",
};

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
