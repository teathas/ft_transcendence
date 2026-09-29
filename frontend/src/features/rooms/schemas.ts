import { z } from "zod";

export const roomStatusSchema = z.enum(["active", "archived"]);

/**
 * Proposed room contract. There is no `Room` model in Prisma yet — these are
 * the fields the UI needs, kept in one place so the backend can be matched to
 * them (or these adjusted) in a single edit.
 */
export const roomSchema = z.object({
  id: z.uuid(),
  code: z.string().min(4),
  name: z.string().min(1),
  subject: z.string(),
  status: roomStatusSchema,
  participantCount: z.number().int().nonnegative(),
  ownerId: z.uuid(),
  ownerUsername: z.string(),
  lastActiveAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});

/** What `GET /rooms` returns: one page, plus the unpaginated total. */
export const roomPageSchema = z.object({
  items: z.array(roomSchema),
  total: z.number().int().nonnegative(),
});

export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters")
    .max(60, "Room name must be at most 60 characters"),
  subject: z.string().trim().min(1, "Pick a subject"),
});

/** Codes are shown as `ALG-4271`, but typed however people feel like typing. */
export const joinRoomSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(4, "Enter the room code")
    .max(12, "That code looks too long")
    .regex(/^[A-Z0-9-]+$/, "Codes use letters, numbers and dashes only"),
});

/** Aggregates for the KPI row — computed over all rooms, not one page. */
export const roomStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  owned: z.number().int().nonnegative(),
  participants: z.number().int().nonnegative(),
});
