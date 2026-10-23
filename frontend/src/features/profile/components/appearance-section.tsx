"use client";

import { AccentPicker } from "@/components/theme/accent-picker";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Select, type SelectOption } from "@/components/ui/select";
import { useDict } from "@/i18n/client";
import { isLocale, localeNames, locales } from "@/i18n/config";

import { usePreferences } from "../hooks/use-preferences";
import { SectionCard } from "./section-card";

const AUTO = "auto";

export function AppearanceSection() {
  const d = useDict();
  const { language, chooseLanguage } = usePreferences();

  const options: SelectOption[] = [
    { value: AUTO, label: d.profile.appearance.languageAuto },
    ...locales.map((locale) => ({ value: locale, label: localeNames[locale] })),
  ];

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium">
            {d.profile.appearance.language}
          </span>
          <Select
            className="w-full sm:w-56"
            aria-label={d.profile.appearance.language}
            options={options}
            value={options.find(
              (option) => option.value === (language ?? AUTO),
            )}
            onChange={(option) =>
              option &&
              chooseLanguage(isLocale(option.value) ? option.value : null)
            }
            isSearchable={false}
          />
        </div>
      </div>
    </SectionCard>
  );
}
