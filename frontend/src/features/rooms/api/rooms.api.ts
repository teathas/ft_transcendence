import { env } from "@/lib/env";
import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";

import { roomsMocks } from "../mocks";
import { roomListSchema, roomSchema } from "../schemas";
import type { CreateRoomPayload, JoinRoomPayload, Room } from "../types";

/**
 * The only place that knows how rooms are fetched. No endpoint exists yet, so
 * `NEXT_PUBLIC_ENABLE_MOCKS` swaps in local data; drop that branch once the
 * backend is live.
 */
export const roomsApi = {
  async list(): Promise<Room[]> {
    if (env.enableMocks) return roomsMocks.list();

    const { data } = await api.get("/rooms");
    return parseResponse(roomListSchema, data, "GET /rooms");
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
