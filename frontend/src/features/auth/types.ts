import type { z } from "zod";

import type {
  loginResponseSchema,
  loginSchema,
  registerFormSchema,
  registerSchema,
  userSchema,
  userStatusSchema,
} from "./schemas";

// Types are derived from the schemas so validation and typing cannot drift.
export type UserStatus = z.infer<typeof userStatusSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

/** What the app needs after signing in: the token plus who you are. */
export type AuthResponse = {
  accessToken: string;
  user: User;
};

/** `PATCH /users/me` only accepts these two. */
export type ProfilePatch = {
  username?: string;
  bio?: string;
};
