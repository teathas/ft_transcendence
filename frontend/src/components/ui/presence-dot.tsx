"use client";

import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

/**
 * A green dot on the corner of an avatar while the person is online, grey
 * when not. Put it inside a `relative` wrapper around the avatar.
 */
export function PresenceDot({
  online,
  className,
}: {
  online: boolean;
  className?: string;
}) {
  const d = useDict();

  return (
    <span
      role="img"
      aria-label={online ? d.room.online : d.room.offline}
      title={online ? d.room.online : d.room.offline}
      className={cn(
        "absolute -end-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-card",
        online ? "bg-emerald-500" : "bg-muted-foreground/40",
        className,
      )}
    />
  );
}
