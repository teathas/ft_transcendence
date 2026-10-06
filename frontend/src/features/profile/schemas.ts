import { z } from "zod";

/** Mirrors `UpdateUserDto`: the only two fields `PATCH /users/me` accepts. */
export const accountSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  bio: z.string().trim().max(280, "Bio must be at most 280 characters"),
});
