import { z } from "zod";

export const accountSchema = z.object({
  username: z.string().trim().min(3, "usernameMin").max(20, "usernameMax"),
  email: z.email("email"),
  // `UpdateUserDto`: at most 280 characters. Empty clears it.
  bio: z.string().trim().max(280, "bioMax"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "currentPassword"),
    newPassword: z.string().min(8, "newPasswordMin"),
    confirmPassword: z.string().min(1, "newPasswordConfirm"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "passwordMismatch",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    error: "newPasswordSame",
  });
