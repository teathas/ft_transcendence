"use client";

import { Check } from "lucide-react";

import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

import { usePreferences } from "@/features/profile/hooks/use-preferences";

import { ACCENT_SWATCHES, ACCENTS } from "./accent";
import { useAccent } from "./use-accent";

export function AccentPicker() {
  const d = useDict();
  const accent = useAccent();
  const { chooseAccent } = usePreferences();

  return (
    <div
      role="radiogroup"
      aria-label={d.theme.accent}
      className="flex flex-wrap gap-2"
    >
      {ACCENTS.map((id) => {
        const selected = accent === id;
        const label = d.theme.accents[id];
        const swatch = ACCENT_SWATCHES[id];

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => chooseAccent(id)}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border-2 transition-colors",
              selected
                ? "border-foreground"
                : "border-transparent hover:border-border",
            )}
          >
            <span
              style={{ backgroundColor: swatch }}
              className="flex size-7 items-center justify-center rounded-full text-white"
            >
              {selected && <Check className="size-4" aria-hidden="true" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
