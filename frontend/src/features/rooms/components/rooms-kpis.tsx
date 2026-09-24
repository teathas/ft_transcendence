"use client";

import { useQuery } from "@tanstack/react-query";
import { DoorOpen, Radio, Star, Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { queryKeys } from "@/lib/query/keys";

import { roomsApi } from "../api/rooms.api";

export function RoomsKpis() {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.rooms.stats(),
    queryFn: roomsApi.stats,
  });

  if (isPending || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={DoorOpen}
        label="Total rooms"
        value={data.total}
        hint="Across every subject"
      />
      <StatTile
        icon={Radio}
        label="Active"
        accent="emerald"
        value={data.active}
        hint={`${data.total - data.active} archived`}
      />
      <StatTile
        icon={Star}
        label="I own"
        accent="amber"
        value={data.owned}
        hint="You can archive these"
      />
      <StatTile
        icon={Users}
        label="Participants"
        accent="sky"
        value={data.participants}
        hint="Seats taken right now"
      />
    </div>
  );
}
