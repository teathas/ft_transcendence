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
import type { Room, RoomQuery } from "../types";

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

/** The short list shown in the sidebar and on the dashboard. */
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
