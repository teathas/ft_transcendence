"use client";

import dynamic from "next/dynamic";
import { LoaderCircle } from "lucide-react";

import type { SyncStatus } from "./board-synced";
import type { BoardIdentity } from "./use-board-identity";

/**
 * tldraw is ~19 MB installed and cannot server-render, so it is split out and
 * loaded only once a room is open.
 */
const RoomBoard = dynamic(() => import("./room-board"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      <p className="text-sm">Loading the board…</p>
    </div>
  ),
});

export function BoardPanel({
  roomId,
  identity,
  onStatusChange,
}: {
  roomId: string;
  identity: BoardIdentity;
  onStatusChange: (status: SyncStatus) => void;
}) {
  return (
    <div className="relative min-h-0 flex-1 bg-background">
      <div className="absolute inset-0">
        <RoomBoard
          roomId={roomId}
          identity={identity}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}
