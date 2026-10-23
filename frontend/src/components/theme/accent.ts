/**
 * The accent colour: which hue `--primary` takes. Light and dark are separate
 * values in globals.css (`[data-accent]`); `swatch` is only the preview dot.
 * Indigo is the default and has no attribute, so it stays the plain tokens.
 */
export const ACCENTS = [
  { id: "indigo", swatch: "oklch(0.565 0.2 277)" },
  { id: "blue", swatch: "oklch(0.55 0.15 250)" },
  { id: "teal", swatch: "oklch(0.54 0.09 185)" },
  { id: "rose", swatch: "oklch(0.565 0.2 10)" },
  { id: "orange", swatch: "oklch(0.56 0.14 50)" },
] as const;

export type Accent = (typeof ACCENTS)[number]["id"];

export const ACCENT_KEY = "accent";
export const DEFAULT_ACCENT: Accent = "indigo";

/** Copies the saved choice onto <html> before anything is drawn. */
export const ACCENT_SCRIPT = `try{var a=localStorage.getItem("${ACCENT_KEY}");if(${JSON.stringify(
  ACCENTS.map((accent) => accent.id).filter((id) => id !== DEFAULT_ACCENT),
)}.indexOf(a)>-1)document.documentElement.dataset.accent=a}catch(e){}`;
