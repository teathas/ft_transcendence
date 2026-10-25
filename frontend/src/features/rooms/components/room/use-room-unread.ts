"use client";

import { useMemo, useState } from "react";

import { useSession } from "@/features/auth/hooks/use-auth";

import { flattenMessages, useMessages, useRoomFiles } from "../../hooks/use-room";
import type { Message, RoomFile } from "../../types";
import type { RoomPanel } from "./room-panels";

/**
 * What arrived from other people while `visible` was false, oldest first.
 * "Seen" is the newest item at the moment the list was last visible (or when
 * the room first loaded), so history never counts as new.
 */
function useArrivedSince<T extends { id: string }>(
  items: T[],
  visible: boolean,
  isMine: (item: T) => boolean,
): T[] {
  const newest = items.at(-1)?.id ?? null;

  const [seen, setSeen] = useState<string | null>(null);
  // Adjusted while rendering rather than in an effect: no extra paint with a
  // stale badge.
  if ((visible || seen === null) && seen !== newest) setSeen(newest);

  const seenIndex = items.findIndex((item) => item.id === seen);
  if (visible || seenIndex === -1) return [];
  return items.slice(seenIndex + 1).filter((item) => !isMine(item));
}

/**
 * The messages and files that arrived while their panel was not on screen.
 * They drive the badges, and the toast that tells you something just came in.
 */
export function useRoomUnread(roomId: string, panel: RoomPanel | null) {
  const { user } = useSession();
  const { data: pages } = useMessages(roomId);
  const { data: files } = useRoomFiles(roomId);

  const messages = useMemo(() => flattenMessages(pages), [pages]);
  // Newest first from the API; the helper wants oldest first.
  const sortedFiles = useMemo(
    () =>
      [...(files ?? [])].sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt)),
    [files],
  );

  const chat = useArrivedSince<Message>(
    messages,
    panel === "chat",
    (message) =>
      message.authorId === user?.id || message.authorId === "pending",
  );
  const shared = useArrivedSince<RoomFile>(
    sortedFiles,
    panel === "files",
    (file) => file.uploaderId === user?.id,
  );

  return { chat, files: shared };
}
