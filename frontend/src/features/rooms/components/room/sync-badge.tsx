"use client";

import { Radio, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SyncStatus } from "./board-synced";

const LABELS: Record<SyncStatus, { text: string; title: string }> = {
  loading: { text: "Connecting", title: "Connecting to the board server" },
  online: { text: "Live", title: "Everyone sees your cursor and your edits" },
  offline: {
    text: "Local",
    title:
      "This board is saved in your browser only. Other people cannot see it yet.",
  },
  error: {
    text: "Offline",
    title: "The board server is unreachable; your edits stay on this device.",
  },
};

/** Says plainly whether other people can see you — never implies more. */
export function SyncBadge({ status }: { status: SyncStatus }) {
  const { text, title } = LABELS[status];
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
