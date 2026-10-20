"use client";

import { useSyncExternalStore } from "react";

import { realtimeStore } from "./socket";

/** True while the live connection is up. The server render says false. */
export function useRealtimeConnected() {
  return useSyncExternalStore(
    realtimeStore.subscribe,
    realtimeStore.get,
    () => false,
  );
}
