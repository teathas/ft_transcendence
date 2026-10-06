"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { useSession } from "@/features/auth/hooks/use-auth";

import type { Room } from "../types";
import { DeleteRoomModal } from "./delete-room-modal";
import { RoomFormModal } from "./room-form-modal";

/** Edit and delete, shown only to the room's owner. */
export function RoomActions({ room }: { room: Room }) {
  const { user } = useSession();
  const [modal, setModal] = useState<"edit" | "delete" | null>(null);

  if (!user || user.id !== room.ownerId) return null;

  return (
    <>
      <Dropdown
        label={`Actions for ${room.name}`}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${room.name}`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        )}
      >
        <DropdownItem onClick={() => setModal("edit")}>
          <Pencil className="size-4" aria-hidden="true" />
          Edit room
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          onClick={() => setModal("delete")}
          className="text-destructive"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete room
        </DropdownItem>
      </Dropdown>

      <RoomFormModal
        open={modal === "edit"}
        onClose={() => setModal(null)}
        room={room}
      />
      <DeleteRoomModal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        room={room}
      />
    </>
  );
}
