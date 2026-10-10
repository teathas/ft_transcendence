import { z } from "zod";

export const accountSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  email: z.email("Enter a valid email address"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    error: "Choose a password different from your current one",
  });
