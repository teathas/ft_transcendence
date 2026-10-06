import { userSchema } from "./schemas";
import type { User } from "./types";

const STORAGE_KEY = "shared-room.user";

/**
 * Last known user, kept beside the access token so a reload can paint the
 * header and sidebar immediately instead of waiting on `GET /users/me`.
 *
 * It is a cache, never the source of truth: the session query still refetches
 * and overwrites it.
 */
export const sessionCache = {
  read(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      // Validated on the way out: a stale shape from an older build must not
      // reach the UI as if it were fresh.
      const parsed = userSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  },

  write(user: User) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Not being able to cache is harmless.
    }
  },

  clear() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored for the same reason.
    }
  },
};
