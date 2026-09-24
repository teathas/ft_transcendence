import type { z } from "zod";

import type { createRoomSchema, joinRoomSchema, roomSchema } from "./schemas";

export type Room = z.infer<typeof roomSchema>;
export type CreateRoomPayload = z.infer<typeof createRoomSchema>;
export type JoinRoomPayload = z.infer<typeof joinRoomSchema>;
