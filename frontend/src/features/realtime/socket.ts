import { io, type Socket } from "socket.io-client";

import { getValidToken, tokenStore } from "@/lib/api";
import { env } from "@/lib/env";

const RETRY_AFTER_REFUSAL_MS = 5_000;

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
      // A function, so a reconnect sends the current token — renewed first if
      // it has expired while the connection was down.
      auth: (send) => void getValidToken().then((token) => send({ token: token ?? "" })),
    });
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    // After a refusal socket.io does not try again by itself. While someone is
    // still signed in, ask again a little later (with a renewed token).
    let retry: ReturnType<typeof setTimeout> | undefined;
    socket.on("connect_error", () => {
      clearTimeout(retry);
      retry = setTimeout(() => {
        if (socket && !socket.active && tokenStore.get()) socket.connect();
      }, RETRY_AFTER_REFUSAL_MS);
    });
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
