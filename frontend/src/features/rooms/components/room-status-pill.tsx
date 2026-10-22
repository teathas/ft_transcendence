"use client";

import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

import type { RoomStatus } from "../types";

/**
 * Neutral on purpose: green means "people are in it now", which the API
 * cannot tell yet. `active` only means used in the last 7 days.
 */
export function RoomStatusPill({ status }: { status: RoomStatus }) {
  const d = useDict();

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "active" ? "bg-foreground/70" : "bg-muted-foreground/60",
        )}
      />
      {status === "active" ? d.rooms.status.active : d.rooms.status.archived}
    </span>
  );
}
