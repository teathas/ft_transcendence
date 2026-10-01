"use client";

import { useState } from "react";
import { ArrowLeft, Check, Copy, PanelRight, Users } from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

import { useParticipants } from "../../hooks/use-room";
import type { SyncStatus } from "./board-synced";
import { SyncBadge } from "./sync-badge";
import type { Room } from "../../types";

export function RoomHeader({
  room,
  syncStatus,
  isRailOpen,
  onToggleRail,
  onOpenMobileRail,
}: {
  room: Room;
  syncStatus: SyncStatus;
  isRailOpen: boolean;
  onToggleRail: () => void;
  onOpenMobileRail: () => void;
}) {
  const { data: participants } = useParticipants(room.code);
  const [copied, setCopied] = useState(false);

  const online = participants?.filter((person) => person.online) ?? [];

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code stays visible either way.
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3 sm:px-4">
      <Link
        href={routes.rooms}
        aria-label="Back to rooms"
        className={buttonStyles({ variant: "ghost", size: "icon" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
      </Link>

      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold">{room.name}</h1>
        <p className="truncate text-xs text-muted-foreground">{room.subject}</p>
      </div>

      <button
        type="button"
        onClick={copyCode}
        title="Copy the room code"
        className={cn(
          "ml-1 hidden items-center gap-1.5 bg-muted text-muted-foreground hover:text-foreground",
          "rounded-md px-2 py-1 font-mono text-xs transition-colors sm:inline-flex",
        )}
      >
        {room.code}
        {copied ? (
          <Check className="size-3 text-emerald-500" aria-hidden="true" />
        ) : (
          <Copy className="size-3" aria-hidden="true" />
        )}
        <span className="sr-only">
          {copied ? "Code copied" : "Copy room code"}
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <SyncBadge status={syncStatus} />

        <div className="hidden items-center -space-x-2 sm:flex">
          {online.slice(0, 4).map((person) => (
            <Avatar
              key={person.id}
              src={person.avatarUrl}
              name={person.username}
              className="size-7 text-[10px] ring-2 ring-background"
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMobileRail}
          className="lg:hidden"
        >
          <Users className="size-4" aria-hidden="true" />
          {online.length}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleRail}
          aria-label={
            isRailOpen ? "Hide the side panel" : "Show the side panel"
          }
          aria-pressed={isRailOpen}
          className="hidden lg:inline-flex"
        >
          <PanelRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
