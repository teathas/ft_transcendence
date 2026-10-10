import { z } from "zod";

/**
 * Messages are dictionary keys, not sentences: `FieldError` translates them at
 * render, which is the only moment the active language is known. A key the
 * dictionary does not carry is printed as-is, which is what lets the backend's
 * own messages travel the same path untouched.
 */

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
    .min(3, "usernameMinShort")
    .max(32, "usernameMaxShort"),
  password: z.string().min(8, "passwordMinShort"),
});

/**
 * Everything the sign-up form collects, including the confirmation field that
 * never leaves the browser.
 */
const registerFieldsSchema = z.object({
  username: z.string().trim().min(3, "usernameMin").max(30, "usernameMax"),
  email: z.email("email"),
  password: z.string().min(8, "passwordMin"),
  confirmPassword: z.string().min(1, "passwordConfirm"),
});

/**
 * Form schema: the fields plus the cross-field rule. The mismatch is reported
 * on `confirmPassword` so the message renders under the right input.
 */
export const registerFormSchema = registerFieldsSchema.refine(
  (values) => values.password === values.confirmPassword,
  { path: ["confirmPassword"], error: "passwordMismatch" },
);

/** What actually goes to the backend — `confirmPassword` is dropped. */
export const registerSchema = registerFieldsSchema.omit({
  confirmPassword: true,
});
