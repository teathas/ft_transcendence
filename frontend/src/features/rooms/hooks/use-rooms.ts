"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { routes } from "@/config/routes";
import { useLocaleRouter } from "@/i18n/navigation";
import { queryKeys } from "@/lib/query/keys";

import { roomsApi } from "../api/rooms.api";
import type { Room, RoomQuery, UpdateRoomPayload } from "../types";

export const DEFAULT_ROOM_QUERY: RoomQuery = {
  search: "",
  subject: "all",
  status: "all",
  ownership: "all",
  sort: "recent",
  page: 1,
  pageSize: 12,
};

export function useRooms(query: RoomQuery) {
  return useQuery({
    queryKey: queryKeys.rooms.list(query),
    queryFn: () => roomsApi.list(query),
    // Keeps the previous page on screen while the next one loads, so the
    // table does not collapse to skeletons on every page change.
    placeholderData: keepPreviousData,
  });
}

/** The short list shown on the dashboard. */
export function useRecentRooms(limit = 6) {
  return useQuery({
    queryKey: queryKeys.rooms.recent(limit),
    queryFn: () =>
      roomsApi.list({
        ...DEFAULT_ROOM_QUERY,
        // Only the rooms you are in, not every public one.
        ownership: "mine",
        sort: "recent",
        pageSize: limit,
      }),
    select: (page) => page.items,
  });
}

/** Counts over every room you can see; the tabs show them. */
export function useRoomStats() {
  return useQuery({
    queryKey: queryKeys.rooms.stats(),
    queryFn: roomsApi.stats,
  });
}

function useEnterRoom() {
  const queryClient = useQueryClient();
  const router = useLocaleRouter();

  return (room: Pick<Room, "id">) => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    router.push(routes.room(room.id));
  };
}

export function useCreateRoom() {
  const enterRoom = useEnterRoom();
  return useMutation({ mutationFn: roomsApi.create, onSuccess: enterRoom });
}

export function useJoinRoom() {
  const enterRoom = useEnterRoom();
  return useMutation({ mutationFn: roomsApi.join, onSuccess: enterRoom });
}

/** A public room you are not in yet: join it, then open it. */
export function useJoinPublicRoom() {
  const enterRoom = useEnterRoom();
  return useMutation({
    mutationFn: (room: Room) => roomsApi.joinPublic(room.id),
    onSuccess: (_void, room) => enterRoom(room),
  });
}

/** Lists, counts and the room itself all show what changed. */
function useRefreshRooms() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
}

export function useUpdateRoom(id: string) {
  const refresh = useRefreshRooms();
  return useMutation({
    mutationFn: (payload: UpdateRoomPayload) => roomsApi.update(id, payload),
    onSuccess: refresh,
  });
}

/** Deleting and leaving both end with the room gone from your lists. */
function useRoomExit(mutationFn: (id: string) => Promise<void>, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => mutationFn(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.rooms.detail(id) });
      return queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });
}

export const useDeleteRoom = (id: string) => useRoomExit(roomsApi.remove, id);
export const useLeaveRoom = (id: string) => useRoomExit(roomsApi.leave, id);
