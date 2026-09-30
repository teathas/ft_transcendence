"use client";

import {
  ArrowRight,
  Clock,
  DoorOpen,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { routes } from "@/config/routes";
import { useSession } from "@/features/auth/hooks/use-auth";
import { RoomCard } from "@/features/rooms/components/room-card";
import { useRecentRooms } from "@/features/rooms/hooks/use-rooms";

import { DASHBOARD_STATS, formatDuration, WEEK_ACTIVITY } from "../mocks";
import { ActivityChart } from "./activity-chart";

export function DashboardView() {
  const { user } = useSession();
  const { data: rooms, isPending } = useRecentRooms(3);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {user ? `Welcome back, ${user.username}` : "Welcome back"}
          </h1>
          <p className="text-pretty text-muted-foreground">
            Here is what has been happening in your rooms.
          </p>
        </div>

        <Link
          href={routes.rooms}
          className={buttonStyles({ variant: "outline" })}
        >
          Browse all rooms
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={DoorOpen}
          label="Rooms joined"
          value={DASHBOARD_STATS.roomsJoined}
          hint="Since you signed up"
        />
        <StatTile
          icon={Clock}
          accent="emerald"
          label="Collaborated"
          value={formatDuration(DASHBOARD_STATS.minutesCollaborated)}
          hint="Over the last 7 days"
        />
        <StatTile
          icon={MessageSquare}
          accent="amber"
          label="Messages sent"
          value={DASHBOARD_STATS.messagesSent}
          hint="Across every room"
        />
        <StatTile
          icon={FileText}
          accent="sky"
          label="Files shared"
          value={DASHBOARD_STATS.filesShared}
          hint="PDFs, images, documents"
        />
      </div>

      <section className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="font-semibold tracking-tight">
            Time on the board this week
          </h2>
          <p className="text-sm text-muted-foreground">
            Minutes spent in rooms, by day.
          </p>
        </div>

        <ActivityChart data={WEEK_ACTIVITY} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold tracking-tight">Recent rooms</h2>
          <Link
            href={routes.rooms}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            See all
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
