"use client";

import { LogIn, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { CreateRoomForm } from "@/features/rooms/components/create-room-form";
import { JoinRoomForm } from "@/features/rooms/components/join-room-form";

export function FirstRoomStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Open your first room
        </h1>
        <p className="text-pretty text-muted-foreground">
          Start one and share the code, or step into a room someone already
          opened.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Plus className="size-4 text-primary" aria-hidden="true" />
            Create a room
          </h2>
          <CreateRoomForm />
        </section>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <LogIn className="size-4 text-primary" aria-hidden="true" />
            Join with a code
          </h2>
          <JoinRoomForm />
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Link
          href={routes.rooms}
          className="rounded-md text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          I’ll do this later
        </Link>
      </div>
    </div>
  );
}
