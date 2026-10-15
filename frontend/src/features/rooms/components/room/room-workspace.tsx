"use client";

import { useCallback, useMemo, useState } from "react";
import { DoorOpen, TriangleAlert } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { isApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

import { useSession } from "@/features/auth/hooks/use-auth";
import { useRoomChannel } from "@/features/realtime/use-room-channel";

import {
  useParticipants,
  useRoom,
  useRoomFiles,
} from "../../hooks/use-room";
import { BoardPanel } from "./board-panel";
import type { SyncStatus } from "./board-synced";
import { ChatPanel } from "./chat-panel";
import { FilesPanel } from "./files-panel";
import { PanelFrame } from "./panel-frame";
import { PeoplePanel } from "./people-panel";
import { RoomDock } from "./room-dock";
import { RoomHeader } from "./room-header";
import type { RoomPanel } from "./room-panels";
import { useUnreadChat } from "./use-unread-chat";

/** The room owns the whole screen: the app's mobile bar steps aside for it. */
const FULL_HEIGHT = "h-dvh";

function PanelBody({ panel, roomId }: { panel: RoomPanel; roomId: string }) {
  return (
    <>
      {panel === "chat" && <ChatPanel roomId={roomId} />}
      {panel === "files" && <FilesPanel roomId={roomId} />}
      {panel === "people" && <PeoplePanel roomId={roomId} />}
    </>
  );
}

export function RoomWorkspace({ id }: { id: string }) {
  const d = useDict();
  const { data: room, isPending, error } = useRoom(id);
  const { data: participants } = useParticipants(id);
  const { data: files } = useRoomFiles(id);
  const { user } = useSession();
  useRoomChannel(id);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  // One panel at a time, beside the board on wide screens, in a sheet below.
  const [panel, setPanel] = useState<RoomPanel | null>(null);
  const unread = useUnreadChat(id, panel === "chat");

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
  const toggle = (next: RoomPanel) =>
    setPanel((current) => (current === next ? null : next));

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

  const counts = {
    chat: unread,
    files: files?.length,
    people: participants?.length,
  };
  const close = () => setPanel(null);
  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  return (
    <div className={cn(FULL_HEIGHT, "flex flex-col")}>
      <RoomHeader
        room={room}
        syncStatus={syncStatus}
        panel={panel}
        onToggle={toggle}
        counts={counts}
      />

      <div className="flex min-h-0 flex-1">
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* `isolate` keeps the board's own very high z-indexes inside it, so
              the sheet and the dock can sit above them. */}
          <div className="isolate flex min-h-0 flex-1 flex-col">
            <BoardPanel
              roomId={room.id}
              identity={identity}
              onStatusChange={handleStatusChange}
            />
          </div>
          <RoomDock panel={panel} onToggle={toggle} counts={counts} />
        </div>

        {/* Tablets and up: beside the board, which gives up the width. */}
        {panel && (
          <aside
            onKeyDown={closeOnEscape}
            className="hidden w-80 shrink-0 border-s bg-card md:flex lg:w-[22.5rem] xl:w-[25rem]"
          >
            <PanelFrame title={d.room[panel]} onClose={close}>
              <PanelBody panel={panel} roomId={room.id} />
            </PanelFrame>
          </aside>
        )}
      </div>

      {/* Phones: a sheet rising over the board instead of squeezing it. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          panel ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal={panel !== null}
        aria-label={panel ? d.room[panel] : d.room.panels}
        inert={panel === null}
        onKeyDown={closeOnEscape}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-2xl border-t bg-card shadow-2xl",
          "transition-transform duration-200 md:hidden",
          panel ? "translate-y-0" : "translate-y-full",
        )}
      >
        <span
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border"
        />
        {panel && (
          <PanelFrame title={d.room[panel]} onClose={close}>
            <PanelBody panel={panel} roomId={room.id} />
          </PanelFrame>
        )}
      </aside>
    </div>
  );
}
