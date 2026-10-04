"use client";

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useParticipants } from "../../hooks/use-room";

export function PeoplePanel({ roomCode }: { roomCode: string }) {
  const { data: participants, isPending } = useParticipants(roomCode);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-11" />
        ))}
      </div>
    );
  }

  return (
    <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
      {participants?.map((person) => (
        <li
          key={person.id}
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/50"
        >
          <span className="relative">
            <Avatar
              src={person.avatarUrl}
              name={person.username}
              className="size-8"
            />
            {/* The dot doubles as the cursor colour on the board. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-card",
                !person.online && "bg-muted-foreground/40",
              )}
              style={
                person.online ? { backgroundColor: person.color } : undefined
              }
            />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {person.username}
            </span>
            <span className="block text-xs text-muted-foreground">
              {person.online ? "On the board" : "Away"}
            </span>
          </span>

          {person.role === "host" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Host
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
