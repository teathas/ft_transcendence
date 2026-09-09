/**
 * Central query-key factory. Keep every key here so invalidation targets are
 * greppable and server prefetches share the exact key the client reads.
 *
 * Add one namespace per feature, following the `all` -> `list`/`detail` shape.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
} as const;
