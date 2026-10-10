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
  rooms: {
    all: ["rooms"] as const,
    list: (query?: Record<string, unknown>) =>
      [...queryKeys.rooms.all, "list", query ?? {}] as const,
    stats: () => [...queryKeys.rooms.all, "stats"] as const,
    recent: (limit: number) =>
      [...queryKeys.rooms.all, "recent", limit] as const,
    /** Everything a room opens with: room, people, files, board. */
    detail: (id: string) => [...queryKeys.rooms.all, "detail", id] as const,
    /** Pages of messages, newest first; seeded from `detail`. */
    messages: (id: string) =>
      [...queryKeys.rooms.detail(id), "messages"] as const,
  },
  friends: {
    all: ["friends"] as const,
    list: (query?: Record<string, unknown>) =>
      [...queryKeys.friends.all, "list", query ?? {}] as const,
    requests: (kind: string, query?: Record<string, unknown>) =>
      [...queryKeys.friends.all, "requests", kind, query ?? {}] as const,
    summary: () => [...queryKeys.friends.all, "summary"] as const,
  },
  messages: {
    all: ["dm"] as const,
    conversations: () => [...queryKeys.messages.all, "conversations"] as const,
    thread: (friendId: string) =>
      [...queryKeys.messages.all, "thread", friendId] as const,
  },
  users: {
    all: ["users"] as const,
    search: (query?: Record<string, unknown>) =>
      [...queryKeys.users.all, "search", query ?? {}] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
} as const;
