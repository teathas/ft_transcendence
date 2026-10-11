import { z } from "zod";

import { userStatusSchema } from "@/features/auth/schemas";

export const roomStatusSchema = z.enum(["active", "archived"]);
export const roomVisibilitySchema = z.enum(["PUBLIC", "PRIVATE"]);

/** A room as `GET /rooms` and `GET /rooms/:id` describe it. */
export const roomSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  subject: z.string(),
  visibility: roomVisibilitySchema,
  /** Only members get it: it is what lets someone else in. */
  inviteCode: z.string().nullable(),
  status: roomStatusSchema,
  participantCount: z.number().int().nonnegative(),
  ownerId: z.uuid(),
  ownerUsername: z.string(),
  lastActiveAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  isMember: z.boolean(),
});

/** What `GET /rooms` returns: one page, plus the unpaginated total. */
export const roomPageSchema = z.object({
  items: z.array(roomSchema),
  total: z.number().int().nonnegative(),
});

export const createRoomSchema = z.object({
  name: z.string().trim().min(3, "roomNameMin").max(60, "roomNameMax"),
  subject: z.string().trim().min(1, "roomSubject"),
  visibility: roomVisibilitySchema,
});

/** Invite codes are typed however people feel like typing; the API lowercases. */
export const joinRoomSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(4, "roomCodeMin")
    .max(32, "roomCodeMax")
    .regex(/^[A-Z0-9-]+$/, "roomCodeFormat"),
});

/** Aggregates for the KPI row, over every room the caller can see. */
export const roomStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  owned: z.number().int().nonnegative(),
  participants: z.number().int().nonnegative(),
});

// ---- What the screens use ------------------------------------------------

export const participantRoleSchema = z.enum(["host", "guest"]);

export const participantSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  role: participantRoleSchema,
  online: z.boolean(),
  /** Cursor colour on the shared board. */
  color: z.string(),
});

export const messageSchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  authorUsername: z.string(),
  authorColor: z.string(),
  body: z.string(),
  sentAt: z.iso.datetime(),
});

export const roomFileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  kind: z.enum(["pdf", "image", "document"]),
  uploadedBy: z.string(),
  uploadedAt: z.iso.datetime(),
  /** Who uploaded it; null once their account is gone. Absent on mock files. */
  uploaderId: z.string().nullable().optional(),
  /** Where the file is served, as a path on the API. Absent on mock files. */
  url: z.string().optional(),
});

// ---- What the API sends --------------------------------------------------
// Mapped to the shapes above in `rooms.api.ts`, so the screens do not depend
// on how the backend names things.

const memberWireSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  status: userStatusSchema,
  role: participantRoleSchema,
  joinedAt: z.iso.datetime(),
});

export const messageWireSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  createdAt: z.iso.datetime(),
  author: z.object({
    id: z.uuid(),
    username: z.string(),
    avatarUrl: z.string().nullable(),
  }),
});

export const messagePageWireSchema = z.object({
  items: z.array(messageWireSchema),
  nextCursor: z.uuid().nullable(),
});

export const fileWireSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  url: z.string(),
  size: z.number().int().nonnegative(),
  mimeType: z.string(),
  createdAt: z.iso.datetime(),
  uploader: z.object({ id: z.uuid(), username: z.string() }).nullable(),
});

/** `GET /rooms/:id`: everything a room needs to open, in one answer. */
export const roomDetailWireSchema = z.object({
  room: roomSchema,
  members: z.array(memberWireSchema),
  messages: messagePageWireSchema,
  files: z.array(fileWireSchema),
});
