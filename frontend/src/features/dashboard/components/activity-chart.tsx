"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { formatDuration, type ActivityPoint } from "../mocks";

/**
 * Minutes collaborated per day. One series, so the title names it and no
 * legend is needed; the peak is labelled directly and every bar carries its
 * value for keyboard and screen-reader users.
 */
export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const peak = Math.max(...data.map((point) => point.minutes));

  return (
    <div className="flex h-48 gap-2" role="group">
      {data.map((point, index) => {
        const height = peak === 0 ? 0 : (point.minutes / peak) * 100;
        const isPeak = point.minutes === peak;
        const isActive = hovered === index;

        return (
          <div
            key={`${point.fullLabel}-${index}`}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
          >
            {/* Its own row, so a value never sits on top of its bar. */}
            <span
              aria-hidden="true"
              className={cn(
                "h-4 text-xs font-medium tabular-nums",
                isActive
                  ? "text-foreground"
                  : isPeak
                    ? "text-muted-foreground"
                    : "text-transparent",
              )}
            >
              {formatDuration(point.minutes)}
            </span>

            <div className="flex w-full flex-1 items-end justify-center">
              <button
                type="button"
                aria-label={`${point.fullLabel}: ${formatDuration(point.minutes)}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                style={{ height: `${Math.max(height, 3)}%` }}
                className={cn(
                  "w-full max-w-10 rounded-t-[4px] bg-chart-1 transition-opacity",
                  // Hover dims the others rather than recolouring this one,
                  // so the series keeps a single identity.
                  hovered !== null && !isActive && "opacity-40",
                )}
              />
            </div>

            <span className="w-full border-t border-border pt-1.5 text-center text-xs text-muted-foreground">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
