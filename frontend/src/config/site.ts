import type { Route } from "next";

export const siteConfig = {
  name: "Shared Room",
  title: "Shared Room",
  tagline:
    "One room. One shared workspace. Everyone sees everything in real time.",
  description:
    "A real-time collaborative classroom where everyone can write, draw, chat and share files in the same room.",
  /** Top-level navigation. `Route` is checked against real routes. */
  nav: [] as { title: string; href: Route }[],
} as const;

export type SiteConfig = typeof siteConfig;
