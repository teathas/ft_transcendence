"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { getPasswordStrength } from "../password-strength";

// Fixed semantic colours rather than theme tokens: weak/strong reads the same
// way in both themes, with the darker shade reserved for dark backgrounds.
const BAR_COLORS = [
  "",
  "bg-red-500 dark:bg-red-400",
  "bg-orange-500 dark:bg-orange-400",
  "bg-amber-500 dark:bg-amber-400",
  "bg-emerald-500 dark:bg-emerald-400",
] as const;

const TEXT_COLORS = [
  "text-muted-foreground",
  "text-red-600 dark:text-red-400",
  "text-orange-600 dark:text-orange-400",
  "text-amber-600 dark:text-amber-400",
  "text-emerald-600 dark:text-emerald-400",
] as const;

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label, checks } = getPasswordStrength(password);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className="flex flex-1 gap-1"
          role="meter"
          aria-label="Password strength"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={score}
          aria-valuetext={label}
        >
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                step <= score ? BAR_COLORS[score] : "bg-muted",
              )}
            />
          ))}
        </div>

        <span className={cn("text-xs font-medium", TEXT_COLORS[score])}>
          {label}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((check) => (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              check.passed
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground",
            )}
          >
            <Check
              className={cn("size-3 shrink-0", !check.passed && "opacity-40")}
              aria-hidden="true"
            />
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
