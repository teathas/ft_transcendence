import { z } from "zod";

import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";
import { env } from "@/lib/env";

import { colorFor } from "../colors";
import { roomDetailMocks, roomsMocks } from "../mocks";
import {
  fileWireSchema,
  messagePageWireSchema,
  messageWireSchema,
  roomDetailWireSchema,
  roomPageSchema,
  roomSchema,
  roomStatsSchema,
} from "../schemas";
import type {
  CreateRoomPayload,
  JoinRoomPayload,
  Message,
  MessagePage,
  Participant,
  Room,
  RoomDetail,
  RoomFile,
  RoomPage,
  RoomQuery,
  RoomStats,
} from "../types";

type MessageWire = z.infer<typeof messageWireSchema>;
type FileWire = z.infer<typeof fileWireSchema>;
type DetailWire = z.infer<typeof roomDetailWireSchema>;

export const toMessage = (wire: MessageWire): Message => ({
  id: wire.id,
  authorId: wire.author.id,
  authorUsername: wire.author.username,
  authorColor: colorFor(wire.author.id),
  body: wire.content,
  sentAt: wire.createdAt,
});

const toMessagePage = (
  wire: z.infer<typeof messagePageWireSchema>,
): MessagePage => ({
  items: wire.items.map(toMessage),
  nextCursor: wire.nextCursor,
});

const kindOf = (mimeType: string): RoomFile["kind"] =>
  mimeType.startsWith("image/")
    ? "image"
    : mimeType === "application/pdf"
      ? "pdf"
      : "document";

export const toFile = (wire: FileWire): RoomFile => ({
  id: wire.id,
  name: wire.name,
  sizeBytes: wire.size,
  kind: kindOf(wire.mimeType),
  uploadedBy: wire.uploader?.username ?? "",
  uploaderId: wire.uploader?.id ?? null,
  uploadedAt: wire.createdAt,
  url: wire.url,
});

export const toParticipant = (
  member: DetailWire["members"][number],
): Participant => ({
  id: member.id,
  username: member.username,
  avatarUrl: member.avatarUrl,
  role: member.role,
  online: member.status === "ONLINE",
  color: colorFor(member.id),
});

/** One room's card data. A function of its own so `roomsApi.create` can be passed around unbound. */
async function view(id: string): Promise<Room> {
  const { data } = await api.get(`/rooms/${id}`);
  return parseResponse(z.object({ room: roomSchema }), data, "GET /rooms/:id")
    .room;
}

/**
 * The only place that knows how rooms are fetched. `NEXT_PUBLIC_ENABLE_MOCKS`
 * still swaps in local data. Lists are filtered, sorted and paged by the API:
 * the query goes out as params, one request per change.
 */
export const roomsApi = {
  async list(query: RoomQuery): Promise<RoomPage> {
    if (env.enableMocks) return roomsMocks.list(query);

    const { data } = await api.get("/rooms", {
      params: { ...query, search: query.search.trim() || undefined },
    });
    return parseResponse(roomPageSchema, data, "GET /rooms");
  },

  async stats(): Promise<RoomStats> {
    if (env.enableMocks) return roomsMocks.stats();

    const { data } = await api.get("/rooms/stats");
    return parseResponse(roomStatsSchema, data, "GET /rooms/stats");
  },

  /** The room and everything in it: members, latest messages, files, board. */
  async detail(id: string): Promise<RoomDetail> {
    if (env.enableMocks) return roomDetailMocks.detail(id);

    const { data } = await api.get(`/rooms/${id}`);
    const wire = parseResponse(roomDetailWireSchema, data, "GET /rooms/:id");
    return {
      room: wire.room,
      participants: wire.members.map(toParticipant),
      messages: toMessagePage(wire.messages),
      files: wire.files.map(toFile),
    };
  },

  /** Older messages, from the cursor a page handed out. */
  async messages(id: string, cursor?: string): Promise<MessagePage> {
    if (env.enableMocks) return roomDetailMocks.messages();

    const { data } = await api.get(`/rooms/${id}/messages`, {
      params: { cursor },
    });
    return toMessagePage(
      parseResponse(messagePageWireSchema, data, "GET /rooms/:id/messages"),
    );
  },

  async sendMessage(id: string, body: string): Promise<Message> {
    if (env.enableMocks) return roomDetailMocks.sendMessage(body);

    const { data } = await api.post(`/rooms/${id}/messages`, { content: body });
    return toMessage(
      parseResponse(messageWireSchema, data, "POST /rooms/:id/messages"),
    );
  },

  async deleteMessage(id: string, messageId: string): Promise<void> {
    if (env.enableMocks) return roomDetailMocks.deleteMessage(messageId);

    await api.delete(`/rooms/${id}/messages/${messageId}`);
  },

  async uploadFile(
    id: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<RoomFile> {
    if (env.enableMocks) {
      const uploaded = await roomDetailMocks.uploadFile(file);
      onProgress?.(100);
      return uploaded;
    }

    const body = new FormData();
    body.append("file", file, file.name);

    const { data } = await api.post(`/rooms/${id}/files`, body, {
      // Let the browser set multipart with its boundary.
      headers: { "Content-Type": "multipart/form-data" },
      // Large files on slow connections must not inherit the global 15 s limit.
      timeout: 0,
      onUploadProgress: ({ loaded, total }) => {
        if (total)
          onProgress?.(Math.min(100, Math.round((loaded / total) * 100)));
      },
    });
    return toFile(parseResponse(fileWireSchema, data, "POST /rooms/:id/files"));
  },

  async deleteFile(id: string, fileId: string): Promise<void> {
    if (env.enableMocks) return roomDetailMocks.deleteFile(fileId);

    await api.delete(`/rooms/${id}/files/${fileId}`);
  },

  async create(payload: CreateRoomPayload): Promise<Room> {
    if (env.enableMocks) return roomsMocks.create(payload);

    const { data } = await api.post("/rooms", payload);
    // The create answer is the bare room; the screens want the full view.
    const created = parseResponse(
      z.object({ id: z.uuid() }),
      data,
      "POST /rooms",
    );
    return view(created.id);
  },

  /** Joins with an invite code, the only way into a private room. */
  async join(payload: JoinRoomPayload): Promise<Room> {
    if (env.enableMocks) return roomsMocks.join(payload);

    const { data } = await api.post("/rooms/join", {
      inviteCode: payload.code,
    });
    return parseResponse(roomSchema, data, "POST /rooms/join");
  },

  /** Joins a public room you found in the list. */
  async joinPublic(id: string): Promise<void> {
    if (env.enableMocks) return;

    await api.post(`/rooms/${id}/join`, {});
  },
};
