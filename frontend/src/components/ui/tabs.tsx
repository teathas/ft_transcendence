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
  controls,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  /** `fill`: equal-width tabs, the picked one solid. */
  variant?: "underline" | "pills" | "fill";
  /** The id of the panel the tabs switch, for screen readers. */
  controls?: string;
}) {
  // Arrow keys move between tabs (mirrored in RTL), Home and End jump to the
  // ends; only the picked tab is in the Tab order.
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const index = items.findIndex((item) => item.id === value);
    const step = (event.key === "ArrowRight") !== rtl ? 1 : -1;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (index + step + items.length) % items.length;
    onChange(items[next].id);
    event.currentTarget
      .querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "flex",
        variant === "underline"
          ? "gap-1 overflow-x-auto border-b [scrollbar-width:none]"
          : variant === "pills"
            ? "w-fit gap-0.5 rounded-lg border p-0.5"
            : "grid auto-cols-fr grid-flow-col gap-1",
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
            aria-controls={controls}
            tabIndex={selected ? 0 : -1}
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
                : variant === "pills"
                  ? [
                      "rounded-md px-3 py-1.5 text-sm",
                      selected
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    ]
                  : [
                      "min-h-11 justify-center rounded-lg px-3 text-sm",
                      selected
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    ],
            )}
          >
            {item.label}
            {item.count ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] leading-none font-medium tabular-nums",
                  selected
                    ? variant === "fill"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/15 text-primary"
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
