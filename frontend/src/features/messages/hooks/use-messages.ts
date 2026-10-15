"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

import { useRealtimeConnected } from "@/features/realtime/use-realtime-connected";

import { messagesApi } from "../api/messages.api";
import type { ThreadPage } from "../types";

// The live connection pushes new messages. Asking again is only the fallback
// for while it is down.
const THREAD_POLL = 4_000;
const LIST_POLL = 10_000;

export function useConversations() {
  const connected = useRealtimeConnected();
  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: messagesApi.conversations,
    refetchInterval: connected ? false : LIST_POLL,
  });
}

export function useChatFriend(friendId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(friendId),
    queryFn: () => messagesApi.friend(friendId),
  });
}

/** Pages run newest to oldest: page 0 is the latest messages. */
export function useThread(friendId: string) {
  const connected = useRealtimeConnected();
  return useInfiniteQuery({
    queryKey: queryKeys.messages.thread(friendId),
    queryFn: ({ pageParam }) => messagesApi.thread(friendId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    refetchInterval: connected ? false : THREAD_POLL,
  });
}

export function useSendMessage(friendId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => messagesApi.send(friendId, content),
    onSuccess: (message) => {
      // Show it at once instead of waiting for the next poll.
      queryClient.setQueryData<InfiniteData<ThreadPage, string | undefined>>(
        queryKeys.messages.thread(friendId),
        (data) => {
          if (!data) return data;
          const [first, ...rest] = data.pages;
          if (first.items.some((item) => item.id === message.id)) return data;
          return {
            ...data,
            pages: [{ ...first, items: [message, ...first.items] }, ...rest],
          };
        },
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations(),
      });
    },
  });
}

/** Opening a conversation reads it; the badges then drop. */
export function useMarkRead(friendId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => messagesApi.markRead(friendId),
    onSuccess: () => {
      // Without this the thread keeps showing them as unread until the next
      // poll, and the screen asks to mark them read again.
      const readAt = new Date().toISOString();
      queryClient.setQueryData<InfiniteData<ThreadPage, string | undefined>>(
        queryKeys.messages.thread(friendId),
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((message) =>
                message.senderId === friendId && !message.readAt
                  ? { ...message, readAt }
                  : message,
              ),
            })),
          },
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.friends.summary(),
      });
    },
  });
}
