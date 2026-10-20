"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/client";

/** Title bar and body shared by every panel, on the side or in the sheet. */
export function PanelFrame({
  title,
  count,
  onClose,
  children,
}: {
  title: string;
  count?: number;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const d = useDict();

  return (
    <section
      aria-label={title}
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col"
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b ps-4 pe-2">
        <h2 className="flex items-baseline gap-2 text-base font-semibold">
          {title}
          {count ? (
            <span className="text-sm font-normal text-muted-foreground tabular-nums">
              {count}
            </span>
          ) : null}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label={d.room.closePanel}
          onClick={onClose}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </section>
  );
}
