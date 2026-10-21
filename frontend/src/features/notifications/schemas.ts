import { z } from "zod";

export const notificationTypeSchema = z.enum([
  "FRIEND_REQUEST",
  "FRIEND_REQUEST_ACCEPTED",
  "FRIEND_REQUEST_REJECTED",
  "FRIEND_REMOVED",
  "NEW_DIRECT_MESSAGE",
  "DIRECT_MESSAGE_DELETED",
  "ROOM_CREATED",
  "ROOM_UPDATED",
  "ROOM_DELETED",
  "ROOM_MEMBER_JOINED",
  "ROOM_MEMBER_LEFT",
  "NEW_ROOM_MESSAGE",
  "ROOM_MESSAGE_DELETED",
  "ROOM_FILE_UPLOADED",
  "ROOM_FILE_DELETED",
  "PROFILE_UPDATED",
  "PASSWORD_CHANGED",
  "AVATAR_UPDATED",
  "API_KEY_CREATED",
  "API_KEY_REVOKED",
]);

export const notificationSchema = z.object({
  id: z.uuid(),
  recipientId: z.uuid(),
  actorId: z.uuid().nullable(),
  type: notificationTypeSchema,
  data: z.record(z.string(), z.unknown()).nullable(),
  readAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  actor: z
    .object({
      id: z.uuid(),
      username: z.string(),
      avatarUrl: z.string().nullable(),
    })
    .nullable()
    .optional(),
});

export const notificationsPageSchema = z.object({
  items: z.array(notificationSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export const unreadCountSchema = z.object({
  count: z.number().int().nonnegative(),
});
