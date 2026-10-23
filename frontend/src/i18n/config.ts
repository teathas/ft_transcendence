/**
 * The three languages the app ships in, and everything that depends only on
 * which one is active. No dictionary is imported here, so this module is cheap
 * enough for the proxy, which runs before every request.
 */
export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Arabic is written right to left, which flips the whole layout — see the
 * `dir` attribute set in the root layout.
 */
export const directions = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
} as const satisfies Record<Locale, "ltr" | "rtl">;

/** Each language named in itself, which is how a switcher should read. */
export const localeNames = {
  en: "English",
  fr: "Français",
  ar: "العربية",
} as const satisfies Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The cookie the proxy writes so a returning visitor keeps their choice. */
export const LOCALE_COOKIE = "locale";

/**
 * The first language the browser lists that the app speaks, best-first. The
 * proxy does the same on the server from the Accept-Language header.
 */
export function browserLocale(): Locale {
  for (const language of navigator.languages) {
    const code = language.split("-")[0].toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}
