"use client";

import { useQuery } from "@tanstack/react-query";
import { DoorOpen, Radio, Star, Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { queryKeys } from "@/lib/query/keys";

import { roomsApi } from "../api/rooms.api";

export function RoomsKpis() {
  const d = useDict();
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
        label={d.rooms.kpis.total}
        value={data.total}
        hint={d.rooms.kpis.totalHint}
      />
      <StatTile
        icon={Radio}
        label={d.rooms.kpis.active}
        accent="emerald"
        value={data.active}
        hint={t(d.rooms.kpis.activeHint, { count: data.total - data.active })}
      />
      <StatTile
        icon={Star}
        label={d.rooms.kpis.owned}
        accent="amber"
        value={data.owned}
        hint={d.rooms.kpis.ownedHint}
      />
      <StatTile
        icon={Users}
        label={d.rooms.kpis.participants}
        accent="sky"
        value={data.participants}
        hint={d.rooms.kpis.participantsHint}
      />
    </div>
  );
}
