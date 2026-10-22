"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";
import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const d = useDict();
  const { theme, setTheme } = useTheme();
  // The stored theme is unknown on the server; render nothing as selected
  // until hydration so the markup matches.
  const mounted = useMounted();

  if (compact) {
    // One button that steps through the three, for the 72px rail.
    const index = OPTIONS.findIndex((option) => option.value === theme);
    const current = mounted && index >= 0 ? OPTIONS[index] : OPTIONS[2];
    const next = OPTIONS[(OPTIONS.indexOf(current) + 1) % OPTIONS.length];
    const label = `${d.theme.label}: ${d.theme[current.value]}`;

    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setTheme(next.value)}
        className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <current.icon className="size-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={d.theme.label}
      className="flex items-center gap-0.5 rounded-md border p-0.5"
    >
      {OPTIONS.map(({ value, icon: Icon }) => {
        const label = d.theme[value];
        const selected = mounted && theme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "rounded-sm p-1.5 transition-colors",
              selected
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
