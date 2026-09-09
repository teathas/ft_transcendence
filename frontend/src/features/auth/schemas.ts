import { z } from "zod";

export const userStatusSchema = z.enum(["online", "offline", "away"]);

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  email: z.email(),
  avatarUrl: z.url().nullable(),
  status: userStatusSchema,
  twoFactorEnabled: z.boolean(),
  createdAt: z.iso.datetime(),
});

/** Shape returned by /auth/login and /auth/register. */
export const authResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: userSchema,
});

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(32, "At most 32 characters"),
  password: z.string().min(8, "At least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  displayName: z
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .max(32, "At most 32 characters"),
  email: z.email("Enter a valid email address"),
});
