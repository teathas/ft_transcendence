"use client";

import { useEffect } from "react";

import { env } from "@/lib/env";

import BoardLocal from "./board-local";
import BoardSynced, { type SyncStatus } from "./board-synced";
import type { BoardIdentity } from "./use-board-identity";

import "tldraw/tldraw.css";
import "./board-theme.css";

/**
 * Picks how the board shares state. `local` is the default until a sync server
 * exists; the other two paths are already wired so switching is one env var.
 */
export default function RoomBoard({
  roomId,
  identity,
  onStatusChange,
}: {
  roomId: string;
  identity: BoardIdentity;
  onStatusChange: (status: SyncStatus) => void;
}) {
  const isLocal = env.syncMode === "local";

  useEffect(() => {
    if (isLocal) onStatusChange("offline");
  }, [isLocal, onStatusChange]);

  if (isLocal) {
    return <BoardLocal roomId={roomId} identity={identity} />;
  }

  return (
    <BoardSynced
      roomId={roomId}
      identity={identity}
      onStatusChange={onStatusChange}
    />
  );
}
