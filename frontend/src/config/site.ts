import type { Route } from "next";

export const siteConfig = {
  name: "transcendence",
  title: "transcendence",
  description: "42 transcendence — web application.",
  /** Top-level navigation. `Route` is checked against real routes. */
  nav: [] as { title: string; href: Route }[],
} as const;

export type SiteConfig = typeof siteConfig;
