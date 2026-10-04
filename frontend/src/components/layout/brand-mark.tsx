import { cn } from "@/lib/utils";

/**
 * The Shared Room mark: a board with two participants on it.
 * Kept as inline SVG so it inherits `currentColor` and needs no asset.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-5"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4.5"
          width="18"
          height="14"
          rx="3.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="9.6" cy="11.5" r="1.7" fill="currentColor" />
        <circle cx="15" cy="11.5" r="1.7" fill="currentColor" opacity="0.5" />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className="text-[0.95rem] font-semibold tracking-tight whitespace-nowrap">
        Shared Room
      </span>
    </span>
  );
}
