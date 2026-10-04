<<<<<<< HEAD
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/rooms/[code]">) {
  const { code } = await params;
  return { title: `Room ${code}` };
}

/**
 * Placeholder so the dashboard's room links lead somewhere real. The actual
 * workspace — tldraw board, chat and files — is the next piece of work.
 */
export default async function RoomPage({ params }: PageProps<"/rooms/[code]">) {
  const { code } = await params;

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
        {code}
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">
        This room is not built yet
      </h1>
      <p className="max-w-md text-pretty text-muted-foreground">
        The shared whiteboard, chat and file panel land in the next step. The
        room code above is what you share to invite people.
      </p>
      <Link
        href={routes.rooms}
        className={buttonStyles({ variant: "outline", className: "mt-2" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to your rooms
      </Link>
    </div>
  );
}
=======
import type { Metadata } from "next";

import { RoomWorkspace } from "@/features/rooms/components/room/room-workspace";

export async function generateMetadata({
  params,
}: PageProps<"/rooms/[code]">): Promise<Metadata> {
  const { code } = await params;
  return { title: `Room ${code}` };
}

export default async function RoomPage({ params }: PageProps<"/rooms/[code]">) {
  const { code } = await params;

  return <RoomWorkspace code={code} />;
}
>>>>>>> origin/main
