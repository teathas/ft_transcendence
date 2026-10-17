"use client";

import { useMemo, useState } from "react";

import { useSession } from "@/features/auth/hooks/use-auth";

import { flattenMessages, useMessages } from "../../hooks/use-room";

/**
 * How many messages from other people arrived while the chat was closed.
 * "Seen" is the newest message at the moment the chat was last open (or when
 * the room first loaded), so history never counts as unread.
 */
export function useUnreadChat(roomId: string, chatOpen: boolean) {
  const { data } = useMessages(roomId);
  const { user } = useSession();
  const messages = useMemo(() => flattenMessages(data), [data]);
  const newest = messages.at(-1)?.id ?? null;

  const [seen, setSeen] = useState<string | null>(null);
  // Adjusted while rendering rather than in an effect: no extra paint with a
  // stale badge.
  if ((chatOpen || seen === null) && seen !== newest) setSeen(newest);

  const seenIndex = messages.findIndex((message) => message.id === seen);
  if (chatOpen || seenIndex === -1) return 0;
  return messages
    .slice(seenIndex + 1)
    .filter((message) => message.authorId !== user?.id).length;
}
