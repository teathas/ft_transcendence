"use client";

import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

import { ROOM_PANELS, type RoomPanel } from "./room-panels";

/**
 * The room's controls, floating over the board's edge like a call's button
 * bar: Chat, Files, People. They sit on the side so they never fight the
 * board's own toolbar (bottom) and style panel (top right). Tablets and up:
 * below that the same buttons live in the header.
 */
export function RoomDock({
  panel,
  onToggle,
  counts,
}: {
  panel: RoomPanel | null;
  onToggle: (panel: RoomPanel) => void;
  /** A number to show on each button; 0 or missing shows none. */
  counts: Partial<Record<RoomPanel, number>>;
}) {
  const d = useDict();

  return (
    <div
      role="toolbar"
      aria-label={d.room.panels}
      aria-orientation="vertical"
      className="absolute start-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border bg-card/95 p-1 shadow-lg backdrop-blur md:flex"
    >
      {ROOM_PANELS.map(({ id, icon: Icon }) => {
        const active = panel === id;
        const count = counts[id];

        return (
          <button
            key={id}
            type="button"
            data-panel={id}
            aria-pressed={active}
            aria-label={t(d.room.openPanel, { panel: d.room[id] })}
            onClick={() => onToggle(id)}
            className={cn(
              "relative flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            {d.room[id]}
            {count ? (
              <span
                className={cn(
                  "absolute end-1 top-1 min-w-4 rounded-full px-1 text-center text-[10px] leading-4 font-semibold tabular-nums",
                  id === "chat" && !active
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary-foreground/25 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
