"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

import { roomsApi } from "../api/rooms.api";
import type { Message, MessagePage, RoomDetail, RoomFile } from "../types";

type Pages = InfiniteData<MessagePage, string | undefined>;

/**
 * Opening a room is one request. The messages it carries are also copied into
 * their own paged cache, so older ones can be added above without refetching
 * the room (and its board) each time.
 *
 * No refetch on focus: it would reset that paged history, and until there is a
 * realtime channel a reopen or reload is what brings new things in.
 */
function useRoomDetail<Selected = RoomDetail>(
  id: string,
  select?: (detail: RoomDetail) => Selected,
  { refetchOnMount = true }: { refetchOnMount?: boolean } = {},
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.rooms.detail(id),
    queryFn: async () => {
      const detail = await roomsApi.detail(id);
      queryClient.setQueryData<Pages>(queryKeys.rooms.messages(id), {
        pages: [detail.messages],
        pageParams: [undefined],
      });
      return detail;
    },
    select,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount,
  });
}

/** The workspace's own: opening the room fetches it. */
export const useRoom = (id: string) =>
  useRoomDetail(id, (detail) => detail.room);

// The parts below read what the workspace already fetched. Mounting them later
// must not fetch again — that would reset the paged messages.
const reuse = { refetchOnMount: false };

export const useParticipants = (id: string) =>
  useRoomDetail(id, (detail) => detail.participants, reuse);

export const useRoomFiles = (id: string) =>
  useRoomDetail(id, (detail) => detail.files, reuse);

/** The board as stored: what to start from, and the version to save against. */
export const useRoomBoard = (id: string) =>
  useRoomDetail(id, (detail) => detail.board, reuse);

export function useMessages(id: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.rooms.messages(id),
    queryFn: ({ pageParam }) => roomsApi.messages(id, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    // Filled by the room request; only "load earlier" asks for more.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/** Oldest first, the order a conversation is read in. */
export function flattenMessages(
  data: { pages: MessagePage[] } | undefined,
): Message[] {
  return (data?.pages.flatMap((page) => page.items) ?? []).toReversed();
}

export function useSendMessage(id: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.rooms.messages(id);

  const patchNewest = (change: (items: Message[]) => Message[]) =>
    queryClient.setQueryData<Pages>(queryKey, (data) => {
      if (!data) return data;
      const [first, ...rest] = data.pages;
      return { ...data, pages: [{ ...first, items: change(first.items) }, ...rest] };
    });

  return useMutation({
    mutationFn: (body: string) => roomsApi.sendMessage(id, body),
    // The message appears the instant it is sent; a failure puts the thread
    // back the way it was.
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Pages>(queryKey);
      const pendingId = `pending-${crypto.randomUUID()}`;

      patchNewest((items) => [
        {
          id: pendingId,
          authorId: "pending",
          authorUsername: "You",
          authorColor: "#6366f1",
          body,
          sentAt: new Date().toISOString(),
        },
        ...items,
      ]);
      return { previous, pendingId };
    },
    onError: (_error, _body, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSuccess: (message, _body, context) => {
      patchNewest((items) =>
        items.map((item) => (item.id === context.pendingId ? message : item)),
      );
    },
  });
}

/** Both go through the room's cache directly: no refetch of the whole room. */
function useFilesCache(id: string) {
  const queryClient = useQueryClient();
  return (change: (files: RoomFile[]) => RoomFile[]) =>
    queryClient.setQueryData<RoomDetail>(
      queryKeys.rooms.detail(id),
      (detail) => detail && { ...detail, files: change(detail.files) },
    );
}

export function useUploadRoomFile(id: string) {
  const patchFiles = useFilesCache(id);

  return useMutation({
    mutationFn: (file: File) => roomsApi.uploadFile(id, file),
    onSuccess: (file) => patchFiles((files) => [file, ...files]),
  });
}

export function useDeleteRoomFile(id: string) {
  const patchFiles = useFilesCache(id);

  return useMutation({
    mutationFn: (fileId: string) => roomsApi.deleteFile(id, fileId),
    onSuccess: (_void, fileId) =>
      patchFiles((files) => files.filter((file) => file.id !== fileId)),
  });
}

export function useSaveBoard(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      snapshot,
      baseVersion,
    }: {
      snapshot: Record<string, unknown>;
      baseVersion: number;
    }) => roomsApi.saveBoard(id, snapshot, baseVersion),
    // Keep the cached room in step, so reopening starts from what was saved.
    onSuccess: ({ version }, { snapshot }) =>
      queryClient.setQueryData<RoomDetail>(
        queryKeys.rooms.detail(id),
        (detail) =>
          detail && {
            ...detail,
            board: {
              snapshot,
              version,
              updatedAt: new Date().toISOString(),
            },
          },
      ),
  });
}
