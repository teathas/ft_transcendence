import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";
import { env } from "@/lib/env";

import { z } from "zod";

import { roomDetailMocks, roomsMocks } from "../mocks";
import {
  apiRoomSchema,
  messageSchema,
  roomMemberSchema,
  participantSchema,
  roomFileSchema,
  roomPageSchema,
  roomSchema,
  roomStatsSchema,
} from "../schemas";
import type {
  ApiRoom,
  CreateRoomPayload,
  JoinRoomPayload,
  Room,
  RoomPage,
  Message,
  Participant,
  RoomFile,
  RoomMember,
  RoomQuery,
  RoomStats,
  UpdateRoomPayload,
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

  async get(code: string): Promise<Room> {
    if (env.enableMocks) return roomsMocks.get(code);

    const { data } = await api.get(`/rooms/${code}`);
    return parseResponse(roomSchema, data, "GET /rooms/:code");
  },

  async participants(code: string): Promise<Participant[]> {
    if (env.enableMocks) return roomDetailMocks.participants();

    const { data } = await api.get(`/rooms/${code}/participants`);
    return parseResponse(
      z.array(participantSchema),
      data,
      "GET /rooms/:code/participants",
    );
  },

  async messages(code: string): Promise<Message[]> {
    if (env.enableMocks) return roomDetailMocks.messages();

    const { data } = await api.get(`/rooms/${code}/messages`);
    return parseResponse(
      z.array(messageSchema),
      data,
      "GET /rooms/:code/messages",
    );
  },

  async sendMessage(code: string, body: string): Promise<Message> {
    if (env.enableMocks) return roomDetailMocks.sendMessage(body);

    const { data } = await api.post(`/rooms/${code}/messages`, { body });
    return parseResponse(messageSchema, data, "POST /rooms/:code/messages");
  },

  async files(code: string): Promise<RoomFile[]> {
    if (env.enableMocks) return roomDetailMocks.files();

    const { data } = await api.get(`/rooms/${code}/files`);
    return parseResponse(
      z.array(roomFileSchema),
      data,
      "GET /rooms/:code/files",
    );
  },

  async uploadFile(code: string, file: File): Promise<RoomFile> {
    if (env.enableMocks) return roomDetailMocks.uploadFile(file);

    const body = new FormData();
    body.append("file", file, file.name);

    const { data } = await api.post(`/rooms/${code}/files`, body, {
      // Let the browser set multipart with its boundary.
      headers: { "Content-Type": "multipart/form-data" },
    });
    return parseResponse(roomFileSchema, data, "POST /rooms/:code/files");
  },

  async create(payload: CreateRoomPayload): Promise<ApiRoom> {
    if (env.enableMocks) {
      const room = await roomsMocks.create(payload);
      return {
        id: room.id,
        name: room.name,
        subject: room.subject,
        visibility: payload.visibility,
        inviteCode: room.code,
        ownerId: room.ownerId,
        createdAt: room.createdAt,
      };
    }

    const { data } = await api.post("/rooms", payload);
    return parseResponse(apiRoomSchema, data, "POST /rooms");
  },

  async update(id: string, payload: UpdateRoomPayload): Promise<Room> {
    if (env.enableMocks) return roomsMocks.update(id, payload);

    const { data } = await api.patch(`/rooms/${id}`, payload);
    return parseResponse(roomSchema, data, "PATCH /rooms/:id");
  },

  async remove(id: string): Promise<void> {
    if (env.enableMocks) return roomsMocks.remove(id);

    await api.delete(`/rooms/${id}`);
  },

  async join(payload: JoinRoomPayload): Promise<RoomMember> {
    if (env.enableMocks) {
      return {
        userId: crypto.randomUUID(),
        roomId: payload.roomId,
        joinedAt: new Date().toISOString(),
      };
    }

    // The invite code is only checked for private rooms, so it is omitted
    // rather than sent empty.
    const { data } = await api.post(`/rooms/${payload.roomId}/join`, {
      ...(payload.inviteCode ? { inviteCode: payload.inviteCode } : {}),
    });
    return parseResponse(roomMemberSchema, data, "POST /rooms/:roomId/join");
  },
};
