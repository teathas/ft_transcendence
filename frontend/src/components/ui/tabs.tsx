"use client";

import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  /** A number shown beside the label; hidden when 0 or unknown. */
  count?: number;
};

/**
 * `underline` is the page-level tab bar; `pills` is a compact switch inside a
 * toolbar. Both are a row of buttons that report which one was picked.
 */
export function Tabs({
  items,
  value,
  onChange,
  label,
  variant = "underline",
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  variant?: "underline" | "pills";
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "flex",
        variant === "underline"
          ? "gap-1 overflow-x-auto border-b [scrollbar-width:none]"
          : "w-fit gap-0.5 rounded-lg border p-0.5",
      )}
    >
      {items.map((item) => {
        const selected = item.id === value;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap transition-colors",
              variant === "underline"
                ? [
                    "-mb-px border-b-2 px-4 py-3 text-sm",
                    selected
                      ? "border-primary font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ]
                : [
                    "rounded-md px-3 py-1.5 text-sm",
                    selected
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ],
            )}
          >
            {item.label}
            {item.count ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] leading-none font-medium tabular-nums",
                  selected
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
