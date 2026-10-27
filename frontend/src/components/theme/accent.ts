/**
 * The accent colour: which hue `--primary` takes. Light and dark are separate
 * values in globals.css (`[data-accent]`); the swatch is only the preview dot.
 * Indigo is the default, the plain tokens.
 */
export const ACCENTS = ["indigo", "blue", "teal", "rose", "orange"] as const;

export type Accent = (typeof ACCENTS)[number];

export const DEFAULT_ACCENT: Accent = "indigo";

export const ACCENT_SWATCHES: Record<Accent, string> = {
  indigo: "oklch(0.565 0.2 277)",
  blue: "oklch(0.55 0.15 250)",
  teal: "oklch(0.54 0.09 185)",
  rose: "oklch(0.565 0.2 10)",
  orange: "oklch(0.56 0.14 50)",
};

/** Also written in public/prefs-init.js, which restores it before the first paint. */
export const ACCENT_KEY = "accent";

export const isAccent = (value: unknown): value is Accent =>
  ACCENTS.some((accent) => accent === value);
