import type { z } from "zod";

import type {
  createRoomSchema,
  joinRoomSchema,
  roomPageSchema,
  roomSchema,
  roomStatsSchema,
  roomStatusSchema,
} from "./schemas";

export type RoomStatus = z.infer<typeof roomStatusSchema>;
export type Room = z.infer<typeof roomSchema>;
export type RoomPage = z.infer<typeof roomPageSchema>;
export type RoomStats = z.infer<typeof roomStatsSchema>;
export type CreateRoomPayload = z.infer<typeof createRoomSchema>;
export type JoinRoomPayload = z.infer<typeof joinRoomSchema>;

export type RoomSort = "recent" | "name" | "participants";
export type RoomOwnership = "all" | "owned" | "joined";

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
