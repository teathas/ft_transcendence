"use client";

import { RoomFormModal } from "./room-form-modal";

export function CreateRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <RoomFormModal open={open} onClose={onClose} />;
}
