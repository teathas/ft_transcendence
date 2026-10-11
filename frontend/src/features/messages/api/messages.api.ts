import { z } from "zod";

import { publicUserSchema } from "@/features/friends/schemas";
import type { PublicUser } from "@/features/friends/types";
import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";

import {
  conversationSchema,
  messageSchema,
  threadPageSchema,
} from "../schemas";
import type { Conversation, DirectMessage, ThreadPage } from "../types";

export const THREAD_PAGE_SIZE = 30;

/** One function per backend route; the shapes come from `../schemas`. */
export const messagesApi = {
  async conversations(): Promise<Conversation[]> {
    const { data } = await api.get("/dm");
    return parseResponse(z.array(conversationSchema), data, "GET /dm");
  },

  async thread(friendId: string, cursor?: string): Promise<ThreadPage> {
    const { data } = await api.get(`/dm/${friendId}/messages`, {
      params: { cursor, limit: THREAD_PAGE_SIZE },
    });
    return parseResponse(threadPageSchema, data, "GET /dm/:id/messages");
  },

  async send(friendId: string, content: string): Promise<DirectMessage> {
    const { data } = await api.post(`/dm/${friendId}/messages`, { content });
    return parseResponse(messageSchema, data, "POST /dm/:id/messages");
  },

  async markRead(friendId: string): Promise<void> {
    await api.post(`/dm/${friendId}/read`);
  },

  /** Who the thread is with. Works for a new friend with no message yet. */
  async friend(friendId: string): Promise<PublicUser> {
    const { data } = await api.get(`/users/${friendId}`);
    return parseResponse(publicUserSchema, data, "GET /users/:id");
  },
};
