"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { isApiError } from "@/lib/api";

import { useDeleteRoom } from "../hooks/use-rooms";
import type { Room } from "../types";

export function DeleteRoomModal({
  open,
  onClose,
  room,
}: {
  open: boolean;
  onClose: () => void;
  room: Room;
}) {
  const deleteRoom = useDeleteRoom();
  const apiError = isApiError(deleteRoom.error) ? deleteRoom.error : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete this room?"
      description="The board, the messages and the shared files go with it. This cannot be undone."
    >
      <div className="flex flex-col gap-5">
        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{apiError.message}</AlertDescription>
          </Alert>
        )}

        <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <span className="font-medium">{room.name}</span>
          <span className="block font-mono text-xs text-muted-foreground">
            {room.code}
          </span>
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteRoom.isPending}
            onClick={() => deleteRoom.mutate(room.id, { onSuccess: onClose })}
          >
            {deleteRoom.isPending && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete room
          </Button>
        </div>
      </div>
    </Modal>
  );
}
