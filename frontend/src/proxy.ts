import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";

/**
 * Every page lives under `/{locale}`, so a request without one has to be sent
 * somewhere. The choice, in order: the language the visitor last picked, then
 * what their browser asks for, then English.
 */
function pickLocale(request: NextRequest): string {
  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  if (remembered && isLocale(remembered)) return remembered;

  return fromAcceptLanguage(request.headers.get("accept-language"));
}

/**
 * `fr-CA,fr;q=0.9,en;q=0.8` — browsers already list languages best-first, so
 * the first one we speak wins. Only the part before the dash matters, since
 * the app ships no regional variants.
 */
function fromAcceptLanguage(header: string | null): string {
  for (const part of header?.split(",") ?? []) {
    const language = part.split(";")[0].trim().split("-")[0].toLowerCase();
    if (isLocale(language)) return language;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    // Already localised. Remember the choice so the next bare URL lands in the
    // same language — this is also what the language switcher relies on.
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next's own assets and the files served from /public.
  // `/api` is nginx's business and never reaches this app.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
