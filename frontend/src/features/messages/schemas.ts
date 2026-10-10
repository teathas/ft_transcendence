import { z } from "zod";

import { publicUserSchema } from "@/features/friends/schemas";

/** A message as `GET /dm/:friendId/messages` returns it. */
export const messageSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  senderId: z.uuid(),
  receiverId: z.uuid(),
  createdAt: z.iso.datetime(),
  /** Set once the receiver opened the conversation. */
  readAt: z.iso.datetime().nullable(),
});

/** One page of a thread, newest first; `nextCursor` leads to older messages. */
export const threadPageSchema = z.object({
  items: z.array(messageSchema),
  nextCursor: z.uuid().nullable(),
});

/** An entry of `GET /dm`: a friend, the last message, and what is unread. */
export const conversationSchema = z.object({
  friend: publicUserSchema,
  lastMessage: messageSchema.pick({
    id: true,
    content: true,
    senderId: true,
    createdAt: true,
  }),
  unreadCount: z.number().int().nonnegative(),
});
