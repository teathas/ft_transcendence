"use client";

import { Clock, Lock, Presentation, Users } from "lucide-react";

import { useDict } from "@/i18n/client";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { Room } from "../types";
import { useSubjectLabel } from "../subject-label";
import { RoomLink } from "./room-link";
import { RoomStatusPill } from "./room-status-pill";

// A stable accent per room, so a board is recognisable at a glance.
const ACCENTS = [
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400",
] as const;

function accentFor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash + char.charCodeAt(0)) % 997;
  return ACCENTS[hash % ACCENTS.length];
}

/** `showStatus` adds the status pill; the Dashboard leaves it off. */
export function RoomCard({
  room,
  showStatus = false,
}: {
  room: Room;
  showStatus?: boolean;
}) {
  const d = useDict();
  const { relativeTime } = useFormat();
  const subjectLabel = useSubjectLabel();

  return (
    <RoomLink
      room={room}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border bg-card p-5",
        "transition-all duration-200 hover:border-primary/40",
        "hover:shadow-md hover:shadow-black/[0.05] dark:hover:shadow-black/25",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            accentFor(room.id),
          )}
        >
          <Presentation className="size-5" aria-hidden="true" />
        </span>

        <span className="flex shrink-0 items-center gap-2">
          {room.status === "archived" && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {d.rooms.status.archived}
            </span>
          )}
          {room.visibility === "PRIVATE" && (
            <Lock
              className="size-3.5 text-muted-foreground"
              aria-label={d.rooms.create.private}
            />
          )}
          {room.inviteCode && (
            <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground uppercase">
              {room.inviteCode}
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="leading-snug font-medium text-pretty transition-colors group-hover:text-primary">
          {room.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {subjectLabel(room.subject)} · @{room.ownerUsername}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
        <span
          className="inline-flex items-center gap-1.5"
          title={d.common.people}
        >
          <Users className="size-3.5" aria-hidden="true" />
          {room.participantCount}
        </span>
        {room.lastActiveAt && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {relativeTime(room.lastActiveAt)}
          </span>
        )}
        {showStatus && (
          <span className="ms-auto">
            <RoomStatusPill status={room.status} />
          </span>
        )}
      </div>
    </RoomLink>
  );
}
