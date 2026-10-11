"use client";

import { Radio, WifiOff } from "lucide-react";

import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

import type { SyncStatus } from "./board-synced";

/** The badge's own vocabulary, which is not the connection's. */
const KEYS = {
  loading: "connecting",
  online: "live",
  offline: "local",
  error: "offline",
} as const satisfies Record<SyncStatus, string>;

/** Says plainly whether other people can see you — never implies more. */
export function SyncBadge({ status }: { status: SyncStatus }) {
  const d = useDict();
  const key = KEYS[status];
  const text = d.room.sync[key].text;
  const title = d.room.sync[key].title;
  const isLive = status === "online";

  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium",
        isLive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-muted text-muted-foreground",
      )}
    >
      {isLive ? (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
      ) : status === "loading" ? (
        <Radio className="size-3 animate-pulse" aria-hidden="true" />
      ) : (
        <WifiOff className="size-3" aria-hidden="true" />
      )}
      {text}
    </span>
  );
}
