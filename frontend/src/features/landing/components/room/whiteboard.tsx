import { cn } from "@/lib/utils";

import { PARTICIPANTS } from "../../content";
import { Cursor } from "./cursor";

/**
 * Mock tldraw canvas: a worked algebra problem, a sticky note and two live
 * cursors. Everything is markup — no image asset, no canvas library.
 */
export function Whiteboard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background",
        // Dotted canvas, the way an infinite board reads.
        "[background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:18px_18px]",
        className,
      )}
    >
      <div className="relative flex h-full flex-col justify-center gap-3 p-5 sm:p-7">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Factoring quadratics
        </p>

        <div className="space-y-2">
          <p className="font-mono text-lg font-semibold sm:text-2xl">
            x² + 2x + 1 = 0
          </p>
          <p className="font-mono text-sm text-muted-foreground sm:text-lg">
            (x + 1)² = 0
          </p>

          <p className="relative w-fit font-mono text-base font-semibold sm:text-xl">
            x = −1
            {/* Hand-drawn ring around the answer. The viewBox is stretched to
                the text box, so the stroke is non-scaling to stay even. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
              fill="none"
              className="absolute -top-2 -left-4 h-[calc(100%+1rem)] w-[calc(100%+2rem)] -rotate-2 text-primary"
            >
              <ellipse
                cx="50"
                cy="25"
                rx="46"
                ry="21"
                stroke="currentColor"
                strokeWidth="1.75"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </p>
        </div>

        <div className="absolute right-4 bottom-4 hidden w-48 -rotate-2 rounded-md bg-amber-200 p-2.5 shadow-sm sm:block dark:bg-amber-300">
          <p className="text-[10px] font-semibold tracking-wide text-amber-900 uppercase">
            Remember
          </p>
          <p className="mt-0.5 font-mono text-[11px] whitespace-nowrap text-amber-950">
            (a + b)² = a² + 2ab + b²
          </p>
        </div>
      </div>

      <Cursor
        name={PARTICIPANTS[0].name.split(" ")[0]}
        color={PARTICIPANTS[0].color}
        className="top-[20%] right-[28%] animate-drift"
      />
      <Cursor
        name={PARTICIPANTS[1].name.split(" ")[0]}
        color={PARTICIPANTS[1].color}
        className="bottom-[26%] left-[40%] animate-drift-slow"
      />
    </div>
  );
}
