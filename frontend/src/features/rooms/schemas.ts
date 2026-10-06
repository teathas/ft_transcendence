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

export const visibilitySchema = z.enum(["PUBLIC", "PRIVATE"]);

/** Mirrors `CreateRoomDto`. */
export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters")
    .max(60, "Room name must be at most 60 characters"),
  subject: z.string().trim().min(1, "Pick a subject"),
  visibility: visibilitySchema,
});

/** What `POST /rooms` actually returns — the Prisma `Room` row. */
export const apiRoomSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  subject: z.string(),
  visibility: visibilitySchema,
  inviteCode: z.string(),
  ownerId: z.uuid(),
  createdAt: z.iso.datetime(),
});

/** What `POST /rooms/:roomId/join` returns — a `RoomMember` row. */
export const roomMemberSchema = z.object({
  userId: z.uuid(),
  roomId: z.uuid(),
  joinedAt: z.iso.datetime(),
});

/**
 * The API joins by room id, not by invite code — there is no lookup-by-code
 * route — so the form has to ask for the id. The code is only required for a
 * private room.
 */
export const joinRoomSchema = z.object({
  roomId: z.uuid("Paste the room ID the host shared with you"),
  inviteCode: z.string().trim(),
});

/** Aggregates for the KPI row — computed over all rooms, not one page. */
export const roomStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  owned: z.number().int().nonnegative(),
  participants: z.number().int().nonnegative(),
});

export const participantRoleSchema = z.enum(["host", "guest"]);

export const participantSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  avatarUrl: z.url().nullable(),
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
});
