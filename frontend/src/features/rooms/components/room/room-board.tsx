"use client";

import { useEffect } from "react";

import { env } from "@/lib/env";

import BoardLocal from "./board-local";
import BoardSynced, { type SyncStatus } from "./board-synced";
import type { BoardIdentity } from "./use-board-identity";

import "tldraw/tldraw.css";

/**
 * Picks how the board shares state. `local` is the default until a sync server
 * exists; the other two paths are already wired so switching is one env var.
 */
export default function RoomBoard({
  roomCode,
  identity,
  onStatusChange,
}: {
  roomCode: string;
  identity: BoardIdentity;
  onStatusChange: (status: SyncStatus) => void;
}) {
  const isLocal = env.syncMode === "local";

  useEffect(() => {
    if (isLocal) onStatusChange("offline");
  }, [isLocal, onStatusChange]);

  if (isLocal) {
    return <BoardLocal roomCode={roomCode} identity={identity} />;
  }

  return (
    <BoardSynced
      roomCode={roomCode}
      identity={identity}
      onStatusChange={onStatusChange}
    />
  );
}
