"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { useSession } from "@/features/auth/hooks/use-auth";
import { CreateRoomModal } from "@/features/rooms/components/create-room-modal";
import { JoinRoomModal } from "@/features/rooms/components/join-room-modal";
import { RoomCard } from "@/features/rooms/components/room-card";
import { useRecentRooms } from "@/features/rooms/hooks/use-rooms";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";

import { WEEK_ACTIVITY } from "../mocks";
import { ActivityChart } from "./activity-chart";
import { FriendsOnline } from "./friends-online";

export function DashboardView() {
  const d = useDict();
  const { user } = useSession();
  // Five: the "New room" card takes the first of the six slots.
  const { data: rooms, isPending } = useRecentRooms(5);
  const [modal, setModal] = useState<"create" | "join" | null>(null);
  // Split around the placeholder so only the name is coloured, wherever the
  // language puts it.
  const [beforeName, afterName] = d.dashboard.welcomeNamed.split("{name}");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {user ? (
              <>
                {beforeName}
                <span className="text-primary">{user.username}</span>
                {afterName}
              </>
            ) : (
              d.dashboard.welcome
            )}
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            {d.dashboard.subtitle}
          </p>
        </div>

        <Button variant="outline" onClick={() => setModal("join")}>
          {d.rooms.addMenu.joinWithCode}
        </Button>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold tracking-tight">
            {d.dashboard.recentRooms}
          </h2>
          <Link
            href={routes.rooms}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {d.dashboard.browseAll}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <button
            type="button"
            onClick={() => setModal("create")}
            className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="size-8" aria-hidden="true" />
            <span className="font-medium">{d.nav.newRoom}</span>
          </button>

          {isPending
            ? [0, 1, 2, 3, 4].map((index) => (
                <Skeleton key={index} className="h-44 rounded-xl" />
              ))
            : rooms?.map((room) => <RoomCard key={room.id} room={room} />)}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="mb-6 font-semibold tracking-tight">
            {d.dashboard.chart.title}
          </h2>
          <ActivityChart data={WEEK_ACTIVITY} />
        </section>

        <FriendsOnline />
      </div>

      <CreateRoomModal
        open={modal === "create"}
        onClose={() => setModal(null)}
      />
      <JoinRoomModal open={modal === "join"} onClose={() => setModal(null)} />
    </div>
  );
}
