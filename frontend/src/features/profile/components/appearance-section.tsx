"use client";

import { AccentPicker } from "@/components/theme/accent-picker";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useDict } from "@/i18n/client";

import { SectionCard } from "./section-card";

export function AppearanceSection() {
  const d = useDict();

  return (
    <SectionCard
      title={d.profile.appearance.title}
      description={d.profile.appearance.description}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium">{d.theme.label}</span>
          <ThemeToggle />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium">{d.theme.accent}</span>
          <AccentPicker />
        </div>
      </div>
    </SectionCard>
  );
}
