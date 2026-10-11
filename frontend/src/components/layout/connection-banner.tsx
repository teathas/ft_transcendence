"use client";

import { useSyncExternalStore } from "react";

import { useDict } from "@/i18n/client";
import { connectionStore } from "@/lib/api";

/** A bar across the top of every page while the backend is not answering. */
export function ConnectionBanner() {
  const d = useDict();
  const reachable = useSyncExternalStore(
    connectionStore.subscribe,
    connectionStore.get,
    () => true,
  );

  if (reachable) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-[70] bg-destructive px-4 py-1.5 text-center text-sm font-medium text-destructive-foreground"
    >
      {d.connection.lost}
    </div>
  );
}
