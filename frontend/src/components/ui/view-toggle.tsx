"use client";

import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";

/** Cards or table. Labels come from the caller, so it stays language-free. */
export function ViewToggle({
  view,
  onChange,
  label,
  cardsLabel,
  tableLabel,
}: {
  view: string;
  onChange: (next: string) => void;
  label: string;
  cardsLabel: string;
  tableLabel: string;
}) {
  const options = [
    { value: "cards", label: cardsLabel, icon: LayoutGrid },
    { value: "table", label: tableLabel, icon: List },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex items-center gap-0.5 rounded-lg border p-0.5"
    >
      {options.map(({ value, label: optionLabel, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={view === value}
          aria-label={optionLabel}
          title={optionLabel}
          onClick={() => onChange(value)}
          className={cn(
            "rounded-md p-2 transition-colors",
            view === value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
