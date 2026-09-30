"use client";

import { useState } from "react";
import { LogIn, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { CreateRoomModal } from "@/features/rooms/components/create-room-modal";
import { JoinRoomModal } from "@/features/rooms/components/join-room-modal";

export function FirstRoomStep({ onBack }: { onBack: () => void }) {
  const [modal, setModal] = useState<"create" | "join" | null>(null);

  const CHOICES = [
    {
      key: "create" as const,
      icon: Plus,
      title: "Create a room",
      description: "Start a board and share the code with your group.",
    },
    {
      key: "join" as const,
      icon: LogIn,
      title: "Join with a code",
      description: "Step into a room someone has already opened.",
    },
  ];

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

      <div className="flex flex-col gap-3">
        {CHOICES.map(({ key, icon: Icon, title, description }) => (
          <button
            key={key}
            type="button"
            onClick={() => setModal(key)}
            className="flex items-center gap-4 rounded-xl border bg-card p-5 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-medium">{title}</span>
              <span className="block text-sm text-pretty text-muted-foreground">
                {description}
              </span>
            </span>
          </button>
        ))}
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

      <CreateRoomModal
        open={modal === "create"}
        onClose={() => setModal(null)}
      />
      <JoinRoomModal open={modal === "join"} onClose={() => setModal(null)} />
    </div>
  );
}
