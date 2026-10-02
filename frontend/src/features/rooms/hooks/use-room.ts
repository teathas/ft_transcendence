"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

import { roomsApi } from "../api/rooms.api";
import type { Message } from "../types";

export function useRoom(code: string) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(code),
    queryFn: () => roomsApi.get(code),
    retry: false,
  });
}

export function useParticipants(code: string) {
  return useQuery({
    queryKey: queryKeys.rooms.participants(code),
    queryFn: () => roomsApi.participants(code),
  });
}

export function useMessages(code: string) {
  return useQuery({
    queryKey: queryKeys.rooms.messages(code),
    queryFn: () => roomsApi.messages(code),
  });
}

export function useSendMessage(code: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.rooms.messages(code);

  return useMutation({
    mutationFn: (body: string) => roomsApi.sendMessage(code, body),
    // The message appears the instant it is sent; a failure puts the thread
    // back the way it was.
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Message[]>(queryKey);

      const optimistic: Message = {
        id: `pending-${crypto.randomUUID()}`,
        authorId: "pending",
        authorUsername: "You",
        authorColor: "#6366f1",
        body,
        sentAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(queryKey, (current) => [
        ...(current ?? []),
        optimistic,
      ]);
      return { previous };
    },
    onError: (_error, _body, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUploadRoomFile(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => roomsApi.uploadFile(code, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.files(code),
      });
    },
  });
}

export function useRoomFiles(code: string) {
  return useQuery({
    queryKey: queryKeys.rooms.files(code),
    queryFn: () => roomsApi.files(code),
  });
}
