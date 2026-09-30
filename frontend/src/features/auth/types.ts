import type { z } from "zod";

import type {
  authResponseSchema,
  loginSchema,
  registerFormSchema,
  registerSchema,
  userSchema,
  userStatusSchema,
} from "./schemas";

// Types are derived from the schemas so validation and typing cannot drift.
export type UserStatus = z.infer<typeof userStatusSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

/** Any subset of the fields `PATCH /users/me` accepts. */
export type ProfilePatch = {
  username?: string;
  email?: string;
  avatarUrl?: string | null;
};

export type PasswordChangePayload = {
  currentPassword: string;
  newPassword: string;
};
