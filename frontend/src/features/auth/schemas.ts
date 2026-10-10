import { z } from "zod";

// Mirrors the Prisma `User` model and its `UserStatus` enum exactly.
export const userStatusSchema = z.enum(["ONLINE", "OFFLINE"]);

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  username: z.string(),
  avatarUrl: z.url().nullable(),
  status: userStatusSchema,
  lastSeenAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
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

/**
 * Everything the sign-up form collects, including the confirmation field that
 * never leaves the browser.
 */
const registerFieldsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm your password"),
});

/**
 * Form schema: the fields plus the cross-field rule. The mismatch is reported
 * on `confirmPassword` so the message renders under the right input.
 */
export const registerFormSchema = registerFieldsSchema.refine(
  (values) => values.password === values.confirmPassword,
  { path: ["confirmPassword"], error: "Passwords do not match" },
);

/** What actually goes to the backend — `confirmPassword` is dropped. */
export const registerSchema = registerFieldsSchema.omit({
  confirmPassword: true,
});
