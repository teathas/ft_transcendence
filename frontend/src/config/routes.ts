import type { Route } from "next";

/**
 * Every path the UI navigates to, in one place.
 *
 * The landing CTAs still point at auth because you need an account before you
 * can open a room; once that changes, change it here only.
 */
export const routes = {
  home: "/" as Route,
  features: "/#features" as Route,
  classroom: "/#classroom" as Route,
  howItWorks: "/#how-it-works" as Route,
  login: "/login" as Route,
  register: "/register" as Route,
  dashboard: "/dashboard" as Route,
  rooms: "/rooms" as Route,
  profile: "/profile" as Route,
  friends: "/friends" as Route,
  messages: "/messages" as Route,
  notifications: "/notifications" as Route,
  privacy: "/privacy" as Route,
  terms: "/terms" as Route,
  room: (id: string) => `/rooms/${id}` as Route,
  thread: (friendId: string) => `/messages/${friendId}` as Route,
  user: (userId: string) => `/users/${userId}` as Route,

  createRoom: "/register" as Route,
  joinRoom: "/login" as Route,
} as const;

export const EXTERNAL = {
  github: "https://github.com/teathas/ft_transcendence",
} as const;
