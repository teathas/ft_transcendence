import type { Metadata } from "next";
import { LogIn, Plus } from "lucide-react";

import { CreateRoomForm } from "@/features/rooms/components/create-room-form";
import { JoinRoomForm } from "@/features/rooms/components/join-room-form";
import { RoomsList } from "@/features/rooms/components/rooms-list";

export const metadata: Metadata = {
  title: "Your rooms",
  description: "Open a room, or join one with a code.",
};

export default function RoomsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your rooms
          </h1>
          <p className="text-pretty text-muted-foreground">
            Pick up where you left off, start a new room, or join one with a
            code.
          </p>
        </header>

        <div className="grid rounded-xl border bg-card md:grid-cols-2">
          <section className="border-b p-5 md:border-r md:border-b-0 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Plus className="size-4 text-primary" aria-hidden="true" />
              Create a room
            </h2>
            <CreateRoomForm />
          </section>

          <section className="p-5 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <LogIn className="size-4 text-primary" aria-hidden="true" />
              Join with a code
            </h2>
            <JoinRoomForm />
          </section>
        </div>

        <section aria-labelledby="recent-rooms" className="flex flex-col gap-4">
          <h2 id="recent-rooms" className="text-sm font-semibold">
            Recent rooms
          </h2>
          <RoomsList />
        </section>
      </div>
    </div>
  );
}
