"use client";

import {
  ArrowRight,
  Clock,
  DoorOpen,
  FileText,
  MessageSquare,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { routes } from "@/config/routes";
import { useSession } from "@/features/auth/hooks/use-auth";
import { RoomCard } from "@/features/rooms/components/room-card";
import { useRecentRooms } from "@/features/rooms/hooks/use-rooms";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";

import { DASHBOARD_STATS, WEEK_ACTIVITY } from "../mocks";
import { useActivityFormat } from "../use-activity-format";
import { ActivityChart } from "./activity-chart";

export function DashboardView() {
  const d = useDict();
  const { duration } = useActivityFormat();
  const { user } = useSession();
  const { data: rooms, isPending } = useRecentRooms(3);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {user
              ? t(d.dashboard.welcomeNamed, { name: user.username })
              : d.dashboard.welcome}
          </h1>
          <p className="text-pretty text-muted-foreground">
            {d.dashboard.subtitle}
          </p>
        </div>

        <Link
          href={routes.rooms}
          className={buttonStyles({ variant: "outline" })}
        >
          {d.dashboard.browseAll}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={DoorOpen}
          label={d.dashboard.stats.roomsJoined}
          value={DASHBOARD_STATS.roomsJoined}
          hint={d.dashboard.stats.roomsJoinedHint}
        />
        <StatTile
          icon={Clock}
          accent="emerald"
          label={d.dashboard.stats.collaborated}
          value={duration(DASHBOARD_STATS.minutesCollaborated)}
          hint={d.dashboard.stats.collaboratedHint}
        />
        <StatTile
          icon={MessageSquare}
          accent="amber"
          label={d.dashboard.stats.messagesSent}
          value={DASHBOARD_STATS.messagesSent}
          hint={d.dashboard.stats.messagesSentHint}
        />
        <StatTile
          icon={FileText}
          accent="sky"
          label={d.dashboard.stats.filesShared}
          value={DASHBOARD_STATS.filesShared}
          hint={d.dashboard.stats.filesSharedHint}
        />
      </div>

      <section className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="font-semibold tracking-tight">
            {d.dashboard.chart.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {d.dashboard.chart.subtitle}
          </p>
        </div>

        <ActivityChart data={WEEK_ACTIVITY} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold tracking-tight">
            {d.dashboard.recentRooms}
          </h2>
          <Link
            href={routes.rooms}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {d.common.seeAll}
          </Link>
        </div>

        {isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rooms?.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
