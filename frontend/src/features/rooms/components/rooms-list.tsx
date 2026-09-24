"use client";

import { DoorOpen, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isApiError } from "@/lib/api";

import { useRooms } from "../hooks/use-rooms";
import { RoomCard } from "./room-card";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <DoorOpen className="size-5" aria-hidden="true" />
      </span>
      <p className="font-medium">No rooms yet</p>
      <p className="max-w-xs text-sm text-pretty text-muted-foreground">
        Create one and share the code, or join a room someone else opened.
      </p>
    </div>
  );
}

export function RoomsList() {
  const { data, isPending, isError, error, refetch, isFetching } = useRooms();

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    const message = isApiError(error)
      ? error.message
      : "Something went wrong loading your rooms.";

    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-muted-foreground">
          <TriangleAlert
            className="size-5 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        </span>
        <p className="font-medium">Could not load your rooms</p>
        <p className="max-w-sm text-sm text-pretty text-muted-foreground">
          {message}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (data.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
