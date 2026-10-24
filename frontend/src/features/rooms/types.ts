import type { z } from "zod";

import type {
  createRoomSchema,
  joinRoomSchema,
  messageSchema,
  participantSchema,
  roomFileSchema,
  roomPageSchema,
  roomSchema,
  roomStatsSchema,
  roomStatusSchema,
  roomVisibilitySchema,
} from "./schemas";

export type RoomStatus = z.infer<typeof roomStatusSchema>;
export type RoomVisibility = z.infer<typeof roomVisibilitySchema>;
export type Room = z.infer<typeof roomSchema>;
export type RoomPage = z.infer<typeof roomPageSchema>;
export type RoomStats = z.infer<typeof roomStatsSchema>;
export type CreateRoomPayload = z.infer<typeof createRoomSchema>;
/** Editing asks for the same three fields as creating. */
export type UpdateRoomPayload = CreateRoomPayload;
export type JoinRoomPayload = z.infer<typeof joinRoomSchema>;

export type RoomSort = "recent" | "name" | "participants";
/** `mine` is owned or joined: every room you are in. */
export type RoomOwnership = "all" | "mine" | "owned" | "joined";

/** Everything the list view can ask for, mirrored in the query string. */
export type RoomQuery = {
  search: string;
  subject: string;
  status: RoomStatus | "all";
  ownership: RoomOwnership;
  sort: RoomSort;
  page: number;
  pageSize: number;
};

export type Participant = z.infer<typeof participantSchema>;
export type Message = z.infer<typeof messageSchema>;
export type RoomFile = z.infer<typeof roomFileSchema>;

/** One page of a conversation, newest first, and where the older ones start. */
export type MessagePage = { items: Message[]; nextCursor: string | null };

/** What opening a room loads, already in the shapes the screens use. */
export type RoomDetail = {
  room: Room;
  participants: Participant[];
  messages: MessagePage;
  files: RoomFile[];
};
