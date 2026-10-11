"use client";

import { createContext, use } from "react";

import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";

type I18n = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18n | null>(null);

/**
 * Carries the active language and its phrases to every Client Component.
 *
 * The whole dictionary crosses to the browser — a few kilobytes — which buys
 * something worth more: no component has to await anything to render a label.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: I18n & { children: React.ReactNode }) {
  return <I18nContext value={{ locale, dict }}>{children}</I18nContext>;
}

function useI18n(): I18n {
  const value = use(I18nContext);
  if (!value) throw new Error("useDict and useLocale need <I18nProvider>.");
  return value;
}

/** Every phrase: `const d = useDict();` then `d.rooms.title`. */
export function useDict(): Dictionary {
  return useI18n().dict;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
