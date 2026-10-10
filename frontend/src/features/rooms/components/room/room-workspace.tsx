"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DoorOpen, TriangleAlert, X } from "lucide-react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { isApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

import { useSession } from "@/features/auth/hooks/use-auth";

import { useParticipants, useRoom } from "../../hooks/use-room";
import { BoardPanel } from "./board-panel";
import type { SyncStatus } from "./board-synced";
import { RoomHeader } from "./room-header";
import { RoomRail, type RailTab } from "./room-rail";

/**
 * The workspace fills the viewport below the app chrome: the mobile shell adds
 * a 3.5rem bar, the desktop sidebar does not.
 */
const FULL_HEIGHT = "h-[calc(100svh-3.5rem)] lg:h-svh";

export function RoomWorkspace({ id }: { id: string }) {
  const d = useDict();
  const { data: room, isPending, error } = useRoom(id);
  const { data: participants } = useParticipants(id);
  const { user } = useSession();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");

  // Identity travels with every cursor once a sync server is connected, so it
  // is derived here rather than inside the board.
  const identity = useMemo(
    () => ({
      id: user?.id ?? "anonymous",
      name: user?.username ?? d.room.guest,
      color:
        participants?.find((person) => person.id === user?.id)?.color ??
        "#6366f1",
    }),
    [user?.id, user?.username, participants, d],
  );

  const handleStatusChange = useCallback(
    (status: SyncStatus) => setSyncStatus(status),
    [],
  );
  const [isRailOpen, setIsRailOpen] = useState(true);
  const [isMobileRailOpen, setIsMobileRailOpen] = useState(false);
  const [tab, setTab] = useState<RailTab>("chat");

  useEffect(() => {
    if (!isMobileRailOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileRailOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileRailOpen]);

  if (isPending) {
    return (
      <div className={cn(FULL_HEIGHT, "flex flex-col")}>
        <Skeleton className="h-14 shrink-0 rounded-none" />
        <Skeleton className="m-4 min-h-0 flex-1 rounded-xl" />
      </div>
    );
  }

  // A failed refresh keeps the cached room: only an empty result is an error.
  if (!room) {
    return (
      <div
        className={cn(
          FULL_HEIGHT,
          "flex flex-col items-center justify-center gap-3 px-4 text-center",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10">
          <TriangleAlert
            className="size-5 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        </span>
        <h1 className="text-xl font-semibold tracking-tight">
          {d.room.unavailable.title}
        </h1>
        <p className="max-w-sm text-sm text-pretty text-muted-foreground">
          {isApiError(error) ? error.message : d.room.unavailable.body}
        </p>
        <Link
          href={routes.rooms}
          className={buttonStyles({ variant: "outline", className: "mt-2" })}
        >
          <DoorOpen className="size-4" aria-hidden="true" />
          {d.room.unavailable.back}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn(FULL_HEIGHT, "flex flex-col")}>
      <RoomHeader
        room={room}
        syncStatus={syncStatus}
        isRailOpen={isRailOpen}
        onToggleRail={() => setIsRailOpen((open) => !open)}
        onOpenMobileRail={() => setIsMobileRailOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <BoardPanel
          roomId={room.id}
          identity={identity}
          onStatusChange={handleStatusChange}
        />

        <aside
          className={cn(
            "hidden w-80 shrink-0 flex-col border-s bg-card xl:w-96",
            isRailOpen && "lg:flex",
          )}
        >
          <RoomRail roomId={room.id} tab={tab} onTabChange={setTab} />
        </aside>
      </div>

      {/* Below lg the rail slides up over the board instead of squeezing it. */}
      <div
        aria-hidden="true"
        onClick={() => setIsMobileRailOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isMobileRailOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal={isMobileRailOpen}
        aria-label={d.room.panels}
        inert={!isMobileRailOpen}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex h-[75svh] flex-col rounded-t-xl border-t bg-card",
          "transition-transform duration-200 lg:hidden",
          isMobileRailOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Its own bar: floating the close button over the tabs put it on
            top of the last tab label. */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b">
          <span
            aria-hidden="true"
            className="h-1 w-10 rounded-full bg-border"
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label={d.room.closePanels}
            onClick={() => setIsMobileRailOpen(false)}
            className="absolute end-1.5"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <RoomRail roomId={room.id} tab={tab} onTabChange={setTab} />
      </aside>
    </div>
  );
}
