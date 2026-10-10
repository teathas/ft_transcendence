import type { Route } from "next";

/**
 * Every path the UI navigates to, in one place.
 *
 * The landing CTAs still point at auth because you need an account before you
 * can open a room; once that changes, change it here only.
 */
export const routes = {
  home: "/" as Route,
  login: "/login" as Route,
  register: "/register" as Route,
  dashboard: "/dashboard" as Route,
  rooms: "/rooms" as Route,
  profile: "/profile" as Route,
  room: (code: string) => `/rooms/${code}` as Route,

  createRoom: "/register" as Route,
  joinRoom: "/login" as Route,
} as const;

export const EXTERNAL = {
  github: "https://github.com/teathas/ft_transcendence",
} as const;
