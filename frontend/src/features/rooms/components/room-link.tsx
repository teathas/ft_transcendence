"use client";

import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";

import { useJoinPublicRoom } from "../hooks/use-rooms";
import type { Room } from "../types";

/**
 * Opens a room. A public room you are not in yet is joined first, because the
 * API only opens a room to its members.
 */
export function RoomLink({
  room,
  className,
  children,
}: {
  room: Room;
  className?: string;
  children: React.ReactNode;
}) {
  const join = useJoinPublicRoom();

  return (
    <Link
      href={routes.room(room.id)}
      className={className}
      aria-busy={join.isPending || undefined}
      onClick={(event) => {
        if (room.isMember) return;
        event.preventDefault();
        if (!join.isPending) join.mutate(room);
      }}
    >
      {children}
    </Link>
  );
}
