"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";

import { tokenStore } from "@/lib/api";
import { env } from "@/lib/env";
import { queryKeys } from "@/lib/query/keys";

import { messageSchema as directMessageSchema } from "@/features/messages/schemas";
import type { ThreadPage } from "@/features/messages/types";
import {
  toFile,
  toMessage,
  toParticipant,
} from "@/features/rooms/api/rooms.api";
import {
  fileWireSchema,
  memberWireSchema,
  messageWireSchema,
} from "@/features/rooms/schemas";
import type { MessagePage, RoomDetail } from "@/features/rooms/types";

import { getSocket } from "./socket";

type Session = { id: string } | undefined;

/**
 * Keeps the screens in step with what the server pushes. Each event is turned
 * into a small edit of the cached data (or, where that is not worth it, a
 * refetch of what is on screen), so a message or a new friend request shows
 * up without anyone asking for it.
 *
 * Nothing is rendered: it only needs to sit inside the query client, and does
 * nothing until someone is signed in.
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(
    tokenStore.subscribe,
    tokenStore.get,
    () => null,
  );

  useEffect(() => {
    if (!token || env.enableMocks) return;
    const socket = getSocket();

    const me = () =>
      queryClient.getQueryData<Session>(queryKeys.auth.session())?.id;

    const patchRoom = (
      roomId: string,
      change: (detail: RoomDetail) => RoomDetail,
    ) =>
      queryClient.setQueryData<RoomDetail>(
        queryKeys.rooms.detail(roomId),
        (detail) => detail && change(detail),
      );

    const handlers: Record<string, (payload: never) => void> = {
      // ---- friends and private messages
      "friends:changed": () => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.friends.all });
        void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages.conversations(),
        });
      },

      "dm:message": ({ message }: { message: unknown }) => {
        const parsed = directMessageSchema.safeParse(message);
        const myId = me();
        if (!parsed.success || !myId) return;
        const dm = parsed.data;
        const friendId = dm.senderId === myId ? dm.receiverId : dm.senderId;

        queryClient.setQueryData<InfiniteData<ThreadPage, string | undefined>>(
          queryKeys.messages.thread(friendId),
          (data) => {
            if (!data) return data;
            const [first, ...rest] = data.pages;
            if (data.pages.some((p) => p.items.some((m) => m.id === dm.id))) {
              return data;
            }
            return { ...data, pages: [{ ...first, items: [dm, ...first.items] }, ...rest] };
          },
        );
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages.conversations(),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.friends.summary(),
        });
      },

      "dm:read": ({ readerId }: { readerId: string }) => {
        // Your messages to them are now read: "Seen".
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages.thread(readerId),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages.conversations(),
        });
      },

      // ---- rooms
      "room:message": ({ roomId, message }: { roomId: string; message: unknown }) => {
        const parsed = messageWireSchema.safeParse(message);
        if (!parsed.success) return;
        const incoming = toMessage(parsed.data);

        queryClient.setQueryData<InfiniteData<MessagePage, string | undefined>>(
          queryKeys.rooms.messages(roomId),
          (data) => {
            if (!data) return data;
            if (data.pages.some((p) => p.items.some((m) => m.id === incoming.id))) {
              return data;
            }
            const [first, ...rest] = data.pages;
            return { ...data, pages: [{ ...first, items: [incoming, ...first.items] }, ...rest] };
          },
        );
        void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all, predicate: (q) => q.queryKey[1] === "list" || q.queryKey[1] === "recent" });
      },

      "room:file-added": ({ roomId, file }: { roomId: string; file: unknown }) => {
        const parsed = fileWireSchema.safeParse(file);
        if (!parsed.success) return;
        const added = toFile(parsed.data);
        patchRoom(roomId, (detail) =>
          detail.files.some((f) => f.id === added.id)
            ? detail
            : { ...detail, files: [added, ...detail.files] },
        );
      },

      "room:file-removed": ({ roomId, fileId }: { roomId: string; fileId: string }) =>
        patchRoom(roomId, (detail) => ({
          ...detail,
          files: detail.files.filter((f) => f.id !== fileId),
        })),

      "room:member-joined": ({ roomId, member }: { roomId: string; member: unknown }) => {
        const parsed = memberWireSchema.safeParse(member);
        if (!parsed.success) return;
        const joined = toParticipant(parsed.data);
        patchRoom(roomId, (detail) =>
          detail.participants.some((p) => p.id === joined.id)
            ? detail
            : {
                ...detail,
                participants: [...detail.participants, joined],
                room: { ...detail.room, participantCount: detail.room.participantCount + 1 },
              },
        );
        void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all, predicate: (q) => q.queryKey[1] === "list" });
      },

      "room:member-left": ({ roomId, userId }: { roomId: string; userId: string }) => {
        patchRoom(roomId, (detail) => ({
          ...detail,
          participants: detail.participants.filter((p) => p.id !== userId),
          room: { ...detail.room, participantCount: Math.max(0, detail.room.participantCount - 1) },
        }));
        void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all, predicate: (q) => q.queryKey[1] === "list" || q.queryKey[1] === "recent" });
      },

      "room:owner-changed": ({ roomId, ownerId }: { roomId: string; ownerId: string }) =>
        patchRoom(roomId, (detail) => ({
          ...detail,
          room: { ...detail.room, ownerId },
          participants: detail.participants.map((p) => ({
            ...p,
            role: p.id === ownerId ? "host" : "guest",
          })),
        })),

      // ---- who is online
      "presence:changed": ({ userId, status }: { userId: string; status: "ONLINE" | "OFFLINE" }) => {
        queryClient.setQueriesData<RoomDetail>(
          {
            queryKey: [...queryKeys.rooms.all, "detail"],
            // Only the room itself, not its paged messages beneath it.
            predicate: (q) => q.queryKey.length === 3,
          },
          (detail) =>
            detail && {
              ...detail,
              participants: detail.participants.map((p) =>
                p.id === userId ? { ...p, online: status === "ONLINE" } : p,
              ),
            },
        );
        void queryClient.invalidateQueries({ queryKey: queryKeys.friends.all });
        void queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
        void queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
      },
    };

    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler as (...args: unknown[]) => void);
    }

    // After a drop, whatever was missed is fetched again.
    let first = true;
    const onConnect = () => {
      if (first) return void (first = false);
      void queryClient.invalidateQueries();
    };
    socket.on("connect", onConnect);

    socket.connect();
    return () => {
      for (const [event, handler] of Object.entries(handlers)) {
        socket.off(event, handler as (...args: unknown[]) => void);
      }
      socket.off("connect", onConnect);
      socket.disconnect();
    };
  }, [token, queryClient]);

  return children;
}
