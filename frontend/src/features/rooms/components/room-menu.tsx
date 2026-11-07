"use client";

import { useState } from "react";
import { LogOut, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useSession } from "@/features/auth/hooks/use-auth";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

import { useDeleteRoom, useLeaveRoom } from "../hooks/use-rooms";
import type { Room } from "../types";
import { CreateRoomModal } from "./create-room-modal";
import { RoomConfirmModal } from "./room-confirm-modal";

type Action = "edit" | "delete" | "leave";

/**
 * The card's three dots. The owner edits or deletes the room; any other member
 * can stop following it. Someone who is neither has nothing to do here.
 */
export function RoomMenu({
  room,
  className,
}: {
  room: Room;
  className?: string;
}) {
  const d = useDict();
  const { user } = useSession();
  const [action, setAction] = useState<Action | null>(null);
  const deleteRoom = useDeleteRoom(room.id);
  const leaveRoom = useLeaveRoom(room.id);

  const isOwner = room.ownerId === user?.id;
  if (!isOwner && !room.isMember) return null;

  const close = () => {
    setAction(null);
    deleteRoom.reset();
    leaveRoom.reset();
  };

  return (
    <div className={className}>
      <Dropdown
        label={t(d.rooms.menu.label, { name: room.name })}
        trigger={(triggerProps) => (
          <button
            {...triggerProps}
            type="button"
            aria-label={t(d.rooms.menu.label, { name: room.name })}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground",
              "transition-colors hover:bg-accent hover:text-foreground",
            )}
          >
            <MoreVertical className="size-4" aria-hidden="true" />
          </button>
        )}
      >
        {isOwner ? (
          <>
            <DropdownItem onClick={() => setAction("edit")}>
              <Pencil className="size-4" aria-hidden="true" />
              {d.rooms.menu.edit}
            </DropdownItem>
            <DropdownItem
              onClick={() => setAction("delete")}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {d.rooms.menu.delete}
            </DropdownItem>
            <DropdownItem onClick={() => setAction("leave")}>
            <LogOut className="size-4 rtl:rotate-180" aria-hidden="true" />
            {d.rooms.menu.leave}
          </DropdownItem>
          </>
        ) : (
          <DropdownItem onClick={() => setAction("leave")}>
            <LogOut className="size-4 rtl:rotate-180" aria-hidden="true" />
            {d.rooms.menu.leave}
          </DropdownItem>
        )}
      </Dropdown>

      {action === "edit" && (
        <CreateRoomModal open room={room} onClose={close} />
      )}
      <RoomConfirmModal
        open={action === "delete"}
        title={d.rooms.deleteConfirm.title}
        description={t(d.rooms.deleteConfirm.description, { name: room.name })}
        confirmLabel={d.rooms.deleteConfirm.confirm}
        pending={deleteRoom.isPending}
        error={deleteRoom.error}
        onClose={() => !deleteRoom.isPending && close()}
        onConfirm={() => deleteRoom.mutate()}
      />
      <RoomConfirmModal
        open={action === "leave"}
        title={d.rooms.leaveConfirm.title}
        description={t(d.rooms.leaveConfirm.description, { name: room.name })}
        confirmLabel={d.rooms.leaveConfirm.confirm}
        pending={leaveRoom.isPending}
        error={leaveRoom.error}
        onClose={() => !leaveRoom.isPending && close()}
        onConfirm={() => leaveRoom.mutate()}
      />
    </div>
  );
}
