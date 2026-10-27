"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DoorOpen, TriangleAlert } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { Tabs } from "@/components/ui/tabs";
import { routes } from "@/config/routes";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { isApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

import { useSession } from "@/features/auth/hooks/use-auth";
import { useRoomChannel } from "@/features/realtime/use-room-channel";

import { useParticipants, useRoom } from "../../hooks/use-room";
import { BoardPanel } from "./board-panel";
import type { SyncStatus } from "./board-synced";
import { ChatPanel } from "./chat-panel";
import { FilesPanel } from "./files-panel";
import { PanelFrame } from "./panel-frame";
import { readPanelState, savePanelState } from "./panel-state";
import { PeoplePanel } from "./people-panel";
import { RoomHeader } from "./room-header";
import { ROOM_PANELS, type RoomPanel } from "./room-panels";
import { useRoomUnread } from "./use-room-unread";

/** The room owns the whole screen: the app's mobile bar steps aside for it. */
const FULL_HEIGHT = "h-dvh";
/** Tablets and up: the panel sits beside the board. Below, it is a sheet. */
const WIDE = "(min-width: 48rem)";

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
  const { user } = useSession();
  useRoomChannel(id);
  // One panel is mounted, not both with one hidden by CSS: two chats would
  // double every effect and every input.
  const wide = useMediaQuery(WIDE);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  // Which tab, and whether the panel shows: closing keeps the tab, so the
  // toggle reopens where you were.
  // Read once, before the first paint: this component only mounts in the
  // browser (behind `RequireAuth`), so storage is there and nothing hydrates.
  const [saved] = useState(readPanelState);
  const [tab, setTab] = useState<RoomPanel>(saved.tab);
  const [open, setOpen] = useState(saved.open);
  useEffect(() => savePanelState({ open, tab }), [open, tab]);
  const panel = open ? tab : null;
  const arrived = useRoomUnread(id, panel);
  const unread = arrived.chat.length;
  const unreadFiles = arrived.files.length;

  // Something new came in while its panel was out of sight: say so, once per
  // arrival (a ref remembers how many were already announced).
  const toast = useToast();
  const announced = useRef({ chat: 0, files: 0 });
  const lastMessage = arrived.chat.at(-1);
  const lastFile = arrived.files.at(-1);
  useEffect(() => {
    if (unread > announced.current.chat && lastMessage) {
      toast(t(d.room.toast.message, { name: lastMessage.authorUsername }));
    }
    if (unreadFiles > announced.current.files && lastFile) {
      toast(
        t(d.room.toast.file, { name: lastFile.uploadedBy, file: lastFile.name }),
      );
    }
    announced.current = { chat: unread, files: unreadFiles };
  }, [unread, unreadFiles, lastMessage, lastFile, toast, d]);

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
  /** Phone icons: open on that tab, or close if it is already showing. */
  const toggle = (next: RoomPanel) => {
    if (open && tab === next) return setOpen(false);
    setTab(next);
    setOpen(true);
  };

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

  const counts: Partial<Record<RoomPanel, number>> = {
    chat: unread,
    files: unreadFiles,
  };
  const close = () => setOpen(false);
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
        panelOpen={open}
        onTogglePanel={() => setOpen((current) => !current)}
      />

      <div className="flex min-h-0 flex-1">
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* `isolate` keeps the board's own very high z-indexes inside it, so
              the phone sheet can sit above them. */}
          <div className="isolate flex min-h-0 flex-1 flex-col">
            <BoardPanel
              roomId={room.id}
              identity={identity}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {/* Tablets and up: beside the board, which gives up the width. Always
            in the page, so the toggle's `aria-controls` points at something. */}
        {wide && (
          <aside
            id="room-panel"
            onKeyDown={closeOnEscape}
            className={cn(
              "hidden w-80 shrink-0 flex-col border-s bg-card lg:w-90",
              open && "flex",
            )}
          >
            {open && (
              <>
                <div className="shrink-0 border-b p-3">
                  <Tabs
                    variant="fill"
                    label={d.room.tabs}
                    controls="room-panel-body"
                    value={tab}
                    onChange={(next) => setTab(next as RoomPanel)}
                    items={ROOM_PANELS.map(({ id: panelId }) => ({
                      id: panelId,
                      label: d.room[panelId],
                      // Chat and files report what arrived; people has no news.
                      count: counts[panelId],
                    }))}
                  />
                </div>
                <div
                  id="room-panel-body"
                  role="tabpanel"
                  aria-label={d.room[tab]}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <PanelBody panel={tab} roomId={room.id} />
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {/* Phones: a sheet rising over the board instead of squeezing it. */}
      {!wide && (
        <>
          <div
            aria-hidden="true"
            onClick={close}
            className={cn(
              "fixed inset-0 z-40 bg-black/50 transition-opacity",
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
              "transition-transform duration-200",
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
        </>
      )}
    </div>
  );
}
