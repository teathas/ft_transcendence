import type { Route } from "next";

/**
 * Product entry points.
 *
 * Rooms have no routes of their own yet, so both room CTAs funnel through
 * auth. When `/rooms/new` and `/rooms/join` land, change them here only —
 * nothing else in the UI hardcodes these paths.
 */
export const routes = {
  home: "/" as Route,
  login: "/login" as Route,
  register: "/register" as Route,
  createRoom: "/register" as Route,
  joinRoom: "/login" as Route,
} as const;

export const EXTERNAL = {
  github: "https://github.com/teathas/ft_transcendence",
} as const;
