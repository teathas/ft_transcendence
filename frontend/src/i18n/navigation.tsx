"use client";

import { useMemo } from "react";
import type { Route } from "next";
import NextLink from "next/link";
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";

import { useLocale } from "./client";
import { isLocale, type Locale } from "./config";

/** `/ar/rooms/42` -> `/rooms/42`. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (first !== undefined && isLocale(first)) return `/${rest.join("/")}`;
  return pathname;
}

/** `/rooms/42` -> `/ar/rooms/42`, leaving anything that is not ours alone. */
export function localeHref(href: string, locale: Locale): string {
  // Absolute URLs and in-page anchors belong to nobody but themselves.
  if (!href.startsWith("/")) return href;

  const bare = stripLocale(href);
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/**
 * `next/link` with the active locale prefixed.
 *
 * Every internal link in the app goes through this, so `routes.ts` can keep
 * listing paths the way they read — `/rooms`, not `/[lang]/rooms`. ESLint
 * blocks `next/link` directly to keep it that way.
 */
export function Link({
  href,
  ...props
}: Omit<React.ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const locale = useLocale();
  return <NextLink href={localeHref(href, locale) as Route} {...props} />;
}

/**
 * The path with the locale removed, which is what active-state checks want:
 * `pathname === routes.rooms` has to hold in all three languages.
 */
export function useBarePathname(): string {
  return stripLocale(useNextPathname());
}

/** `useRouter`, prefixing the locale on the way out. */
export function useLocaleRouter() {
  const router = useNextRouter();
  const locale = useLocale();

  return useMemo(
    () => ({
      push: (href: string) => router.push(localeHref(href, locale) as Route),
      replace: (href: string) =>
        router.replace(localeHref(href, locale) as Route),
    }),
    [router, locale],
  );
}
