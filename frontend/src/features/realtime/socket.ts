import { io, type Socket } from "socket.io-client";

import { tokenStore } from "@/lib/api";
import { env } from "@/lib/env";

let socket: Socket | null = null;
let connected = false;
const listeners = new Set<() => void>();

function setConnected(next: boolean) {
  if (next === connected) return;
  connected = next;
  for (const listener of listeners) listener();
}

/**
 * The one socket.io connection of the page. It is created on first use and
 * only connects when `RealtimeProvider` asks it to, once someone is signed in.
 *
 * Through nginx the API lives under `/api` but socket.io has its own path on
 * the same origin, hence the origin and `/socket.io` rather than the API URL.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(new URL(env.apiUrl).origin, {
      path: "/socket.io",
      autoConnect: false,
      // A function, so a reconnect sends whatever the current token is.
      auth: (send) => send({ token: tokenStore.get() ?? "" }),
    });
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
  }
  return socket;
}

/** Whether the live connection is up; screens poll only while it is not. */
export const realtimeStore = {
  get: () => connected,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
