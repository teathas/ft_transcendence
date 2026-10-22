"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { BellLink } from "@/components/layout/bell-link";
import { Button, buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

import { useSubjectLabel } from "../../subject-label";
import type { Room } from "../../types";
import type { SyncStatus } from "./board-synced";
import { ROOM_PANELS, type RoomPanel } from "./room-panels";
import { SyncBadge } from "./sync-badge";

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
  const [copied, setCopied] = useState(false);

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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-2 sm:gap-3 sm:px-4">
      <Link
        href={routes.dashboard}
        className={buttonStyles({
          variant: "outline",
          className: "h-11 max-sm:w-11 max-sm:px-0",
        })}
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {/* Phones keep the arrow only; the words stay for screen readers. */}
        <span className="max-sm:sr-only">{d.room.leave}</span>
      </Link>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold sm:text-base">
          {room.name}
        </h1>
        <p className="truncate text-xs text-muted-foreground">
          {subjectLabel(room.subject)} · <bdi>@{room.ownerUsername}</bdi>
        </p>
      </div>

      <SyncBadge status={syncStatus} />

      {room.inviteCode && (
        <Button
          onClick={copyCode}
          title={d.room.copyCode}
          className="hidden h-11 px-4 sm:inline-flex"
        >
          {copied && <Check className="size-4" aria-hidden="true" />}
          {copied ? d.room.copied : d.room.invite}
        </Button>
      )}
      {/* Says "Code copied" to screen readers, which do not see the label change. */}
      <span role="status" className="sr-only">
        {copied ? d.room.copied : ""}
      </span>

      <BellLink />

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
