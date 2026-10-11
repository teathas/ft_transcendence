"use client";

import { useState } from "react";
import { ArrowLeft, Check, Link2 } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

import { useParticipants } from "../../hooks/use-room";
import { useSubjectLabel } from "../../subject-label";
import type { Room } from "../../types";
import type { SyncStatus } from "./board-synced";
import { ROOM_PANELS, type RoomPanel } from "./room-panels";
import { SyncBadge } from "./sync-badge";

const STACK = 3;

export function RoomHeader({
  room,
  syncStatus,
  panel,
  onToggle,
  counts,
}: {
  room: Room;
  syncStatus: SyncStatus;
  panel: RoomPanel | null;
  onToggle: (panel: RoomPanel) => void;
  counts: Partial<Record<RoomPanel, number>>;
}) {
  const d = useDict();
  const subjectLabel = useSubjectLabel();
  const { data: participants } = useParticipants(room.id);
  const [copied, setCopied] = useState(false);

  const online = participants?.filter((person) => person.online) ?? [];

  async function copyCode() {
    if (!room.inviteCode) return;
    try {
      await navigator.clipboard.writeText(room.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code is still in the People panel.
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-2 sm:gap-3 sm:px-4">
      <Link
        href={routes.rooms}
        aria-label={d.room.back}
        className={buttonStyles({ variant: "ghost", size: "icon" })}
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
      </Link>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold sm:text-base">
          {room.name}
        </h1>
        <p className="truncate text-xs text-muted-foreground">
          {subjectLabel(room.subject)}
        </p>
      </div>

      <SyncBadge status={syncStatus} />

      {/* Who is here: the first few faces, then a count. */}
      <button
        type="button"
        onClick={() => onToggle("people")}
        aria-label={t(d.room.openPanel, { panel: d.room.people })}
        className="hidden items-center -space-x-2 rounded-full p-1 transition-colors hover:bg-accent sm:flex rtl:space-x-reverse"
      >
        {online.slice(0, STACK).map((person) => (
          <Avatar
            key={person.id}
            src={person.avatarUrl}
            name={person.username}
            className="size-7 text-[10px] ring-2 ring-background"
          />
        ))}
        {online.length > STACK && (
          <span className="z-10 flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium ring-2 ring-background">
            +{online.length - STACK}
          </span>
        )}
      </button>

      {room.inviteCode && (
        <Button
          variant="outline"
          size="sm"
          onClick={copyCode}
          aria-label={copied ? d.room.copied : d.room.copyCode}
          className="hidden sm:inline-flex"
        >
          {copied ? (
            <Check className="size-4 text-emerald-500" aria-hidden="true" />
          ) : (
            <Link2 className="size-4" aria-hidden="true" />
          )}
          {copied ? d.room.copied : d.room.invite}
        </Button>
      )}

      {/* Phones: the dock's three buttons, as icons. */}
      <div className="flex items-center md:hidden">
        {ROOM_PANELS.map(({ id, icon: Icon }) => {
          const count = counts[id];
          return (
            <Button
              key={id}
              variant="ghost"
              size="icon"
              data-panel={id}
              aria-pressed={panel === id}
              aria-label={t(d.room.openPanel, { panel: d.room[id] })}
              onClick={() => onToggle(id)}
              className={cn("relative", panel === id && "bg-accent")}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {count && id === "chat" ? (
                <span className="absolute end-1 top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] leading-4 font-semibold text-primary-foreground">
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
            </Button>
          );
        })}
      </div>
    </header>
  );
}
