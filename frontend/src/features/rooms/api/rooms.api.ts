import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";
import { env } from "@/lib/env";

import { roomsMocks } from "../mocks";
import { roomPageSchema, roomSchema, roomStatsSchema } from "../schemas";
import type {
  CreateRoomPayload,
  JoinRoomPayload,
  Room,
  RoomPage,
  RoomQuery,
  RoomStats,
} from "../types";

/**
 * The only place that knows how rooms are fetched. No endpoint exists yet, so
 * `NEXT_PUBLIC_ENABLE_MOCKS` swaps in local data; drop that branch once the
 * backend is live. The query is sent as params, so paging stays server-side.
 */
export const roomsApi = {
  async list(query: RoomQuery): Promise<RoomPage> {
    if (env.enableMocks) return roomsMocks.list(query);

    const { data } = await api.get("/rooms", { params: query });
    return parseResponse(roomPageSchema, data, "GET /rooms");
  },

  async stats(): Promise<RoomStats> {
    if (env.enableMocks) return roomsMocks.stats();

    const { data } = await api.get("/rooms/stats");
    return parseResponse(roomStatsSchema, data, "GET /rooms/stats");
  },

  async create(payload: CreateRoomPayload): Promise<Room> {
    if (env.enableMocks) return roomsMocks.create(payload);

    const { data } = await api.post("/rooms", payload);
    return parseResponse(roomSchema, data, "POST /rooms");
  },

  async join(payload: JoinRoomPayload): Promise<Room> {
    if (env.enableMocks) return roomsMocks.join(payload);

    const { data } = await api.post(`/rooms/${payload.code}/join`);
    return parseResponse(roomSchema, data, "POST /rooms/:code/join");
  },
};
