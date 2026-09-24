"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import { queryKeys } from "@/lib/query/keys";

import { roomsApi } from "../api/rooms.api";
import type { Room } from "../types";

export function useRooms() {
  return useQuery({
    queryKey: queryKeys.rooms.list(),
    queryFn: roomsApi.list,
  });
}

function useEnterRoom() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (room: Room) => {
    queryClient.setQueryData(queryKeys.rooms.detail(room.code), room);
    void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    router.push(routes.room(room.code));
  };
}

export function useCreateRoom() {
  const enterRoom = useEnterRoom();

  return useMutation({
    mutationFn: roomsApi.create,
    onSuccess: enterRoom,
  });
}

export function useJoinRoom() {
  const enterRoom = useEnterRoom();

  return useMutation({
    mutationFn: roomsApi.join,
    onSuccess: enterRoom,
  });
}
