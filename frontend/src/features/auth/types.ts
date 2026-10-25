import type { z } from "zod";

import type { Accent } from "@/components/theme/accent";
import type { Locale } from "@/i18n/config";

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

/** Any subset of the fields `PATCH /users/me` accepts (`UpdateUserDto`). */
export type ProfilePatch = {
  username?: string;
  email?: string;
  bio?: string;
  /** `null` clears the choice. */
  language?: Locale | null;
  accentColor?: Accent | null;
  /** Accepting is one way: it cannot be taken back. */
  termsAccepted?: true;
};

export type PasswordChangePayload = {
  currentPassword: string;
  newPassword: string;
};
