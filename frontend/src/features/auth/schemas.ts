import { z } from "zod";

// Mirrors the Prisma `User` model and its `UserStatus` enum exactly.
export const userStatusSchema = z.enum(["ONLINE", "OFFLINE"]);

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  status: userStatusSchema,
  lastSeenAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** `POST /auth/login` returns the token on its own — no user. */
export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
});

/**
 * Everything the sign-up form collects, including the confirmation field that
 * never leaves the browser. The bounds match `RegisterDto` on the backend.
 */
const registerFieldsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm your password"),
});

export const registerFormSchema = registerFieldsSchema.refine(
  (values) => values.password === values.confirmPassword,
  { path: ["confirmPassword"], error: "Passwords do not match" },
);

/** What actually goes to the backend — `confirmPassword` is dropped. */
export const registerSchema = registerFieldsSchema.omit({
  confirmPassword: true,
});
