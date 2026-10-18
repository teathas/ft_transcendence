"use client";

import { useEffect } from "react";

import { env } from "@/lib/env";

import { getSocket } from "./socket";

/**
 * While a room is open, listen to its channel: its messages, files, members
 * and who is online. Subscribed again after every reconnect, since the server
 * forgets a socket's channels when it drops.
 */
export function useRoomChannel(roomId: string) {
  useEffect(() => {
    if (env.enableMocks) return;
    const socket = getSocket();

    const join = () => void socket.emit("room:join", { roomId });
    if (socket.connected) join();
    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
      if (socket.connected) socket.emit("room:leave", { roomId });
    };
  }, [roomId]);
}
