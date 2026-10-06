import { cn } from "@/lib/utils";

import { ROOM_CODE, ROOM_TITLE } from "../../content";
import { AvatarStack } from "./avatar-stack";
import { RoomChat } from "./room-chat";
import { RoomFiles } from "./room-files";
import { Whiteboard } from "./whiteboard";

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
      </span>
      Live
    </span>
  );
}

/**
 * A Shared Room, rendered entirely from markup so it stays crisp at every
 * size, adapts on mobile and costs no image download.
 */
export function RoomMockup({
  className,
  boardClassName,
}: {
  className?: string;
  boardClassName?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/[0.07] dark:shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b px-4 py-2.5">
        <span aria-hidden="true" className="hidden gap-1.5 sm:flex">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
        </span>

        <p className="truncate text-xs font-medium">{ROOM_TITLE}</p>

        <span className="ml-auto flex shrink-0 items-center gap-2.5">
          <span className="hidden font-mono text-[10px] text-muted-foreground md:inline">
            {ROOM_CODE}
          </span>
          <AvatarStack />
          <LiveBadge />
        </span>
      </div>

      <div className="grid sm:grid-cols-[1fr_15rem]">
        <Whiteboard className={cn("min-h-60 sm:min-h-76", boardClassName)} />

        {/* Side by side under the board on phones, a sidebar from sm up. */}
        <div className="grid grid-cols-2 border-t sm:grid-cols-1 sm:border-t-0 sm:border-l">
          <RoomChat className="border-r sm:border-r-0 sm:border-b" />
          <RoomFiles />
        </div>
      </div>
    </div>
  );
}
