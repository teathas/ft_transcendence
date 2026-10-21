import { z } from "zod";

import { userStatusSchema } from "@/features/auth/schemas";

/**
 * What the API shows of another person (`PUBLIC_USER_SELECT`): never an email.
 * `avatarUrl` is a path such as `/uploads/avatars/….png`.
 */
export const publicUserSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  status: userStatusSchema,
});

/** Public profile details. Only aggregate activity is exposed, never room data. */
export const publicProfileSchema = publicUserSchema.extend({
  stats: z.object({
    roomsJoined: z.number().int().nonnegative(),
    roomsOwned: z.number().int().nonnegative(),
    messagesSent: z.number().int().nonnegative(),
    filesShared: z.number().int().nonnegative(),
  }),
});

/** How a person stands with the signed-in user, as `GET /users/search` computes it. */
export const relationshipSchema = z.enum(["none", "sent", "received", "friends"]);

/** A search hit: the person, plus their relationship to me. */
export const personSchema = publicUserSchema.extend({
  relationship: relationshipSchema,
});

/** An entry of `GET /friends`. `since` is when the request was accepted. */
export const friendSchema = z.object({
  friendshipId: z.uuid(),
  since: z.iso.datetime(),
  user: publicUserSchema,
});

/** An entry of `GET /friends/requests/received` or `/sent`. */
export const requestSchema = z.object({
  requestId: z.uuid(),
  createdAt: z.iso.datetime(),
  user: publicUserSchema,
});

/** Every list endpoint answers with one page and the total before paging. */
export function pageOf<Item extends z.ZodType>(item: Item) {
  return z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
  });
}

/** What `POST /friends/requests` returns. */
export const sentRequestSchema = z.object({
  id: z.uuid(),
  status: z.enum(["PENDING", "ACCEPTED"]),
  addresseeId: z.uuid(),
  createdAt: z.iso.datetime(),
});

/** What `POST /friends/requests/:id/accept` returns. */
export const acceptedRequestSchema = z.object({
  id: z.uuid(),
  status: z.literal("ACCEPTED"),
});

/** The numbers on the tabs and the navigation badges. */
export const friendsSummarySchema = z.object({
  friends: z.number().int().nonnegative(),
  received: z.number().int().nonnegative(),
  sent: z.number().int().nonnegative(),
  unreadMessages: z.number().int().nonnegative(),
});
