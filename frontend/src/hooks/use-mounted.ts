"use client";

import { useSyncExternalStore } from "react";

// Nothing to subscribe to: the value flips once, at hydration.
const subscribe = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards. Use it to
 * gate UI that depends on browser-only state and would otherwise mismatch
 * during hydration.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
