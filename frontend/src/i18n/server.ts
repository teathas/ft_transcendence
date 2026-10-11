import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

/**
 * The active language, read from the `[lang]` segment.
 *
 * `next/root-params` reaches it from any Server Component, so nothing has to
 * thread `lang` down through props. An unknown value is a 404 rather than a
 * silent fallback: `/zz/rooms` is not a page.
 */
export async function getLocale(): Promise<Locale> {
  const segment = await lang();
  if (typeof segment !== "string" || !isLocale(segment)) notFound();
  return segment;
}

/** Server-side `useDict()`. */
export async function getDict(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}
