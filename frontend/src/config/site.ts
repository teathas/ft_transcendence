import type { Route } from "next";

/**
 * What does not change with the language.
 *
 * The product name is a brand, so it reads the same in all three; the tagline
 * and the description are copy and live in `src/i18n/dictionaries` instead.
 */
export const siteConfig = {
  name: "Shared Room",
  /** Top-level navigation. `Route` is checked against real routes. */
  nav: [] as { title: string; href: Route }[],
} as const;

export type SiteConfig = typeof siteConfig;
