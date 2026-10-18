import { FileText, MessageSquare, Users } from "lucide-react";

/** The three things a room can open beside the board. */
export const ROOM_PANELS = [
  { id: "chat", icon: MessageSquare },
  { id: "files", icon: FileText },
  { id: "people", icon: Users },
] as const;

export type RoomPanel = (typeof ROOM_PANELS)[number]["id"];
