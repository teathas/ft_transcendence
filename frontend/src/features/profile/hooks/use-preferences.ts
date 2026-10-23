"use client";

import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";

import { applyAccent } from "@/components/theme/use-accent";
import type { Accent } from "@/components/theme/accent";
import { useSession, useUpdateProfile } from "@/features/auth/hooks/use-auth";
import { browserLocale, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/client";
import { stripLocale } from "@/i18n/navigation";

/**
 * Language and accent: applied at once on this device, and saved to the
 * account when someone is signed in, so they follow the user everywhere.
 */
export function usePreferences() {
  const { user } = useSession();
  const update = useUpdateProfile();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function chooseAccent(accent: Accent) {
    applyAccent(accent);
    if (user) update.mutate({ accentColor: accent });
  }

  /** `null` is "follow the browser": it is saved empty, shown in that language. */
  function chooseLanguage(language: Locale | null) {
    if (user) update.mutate({ language });

    const next = language ?? browserLocale();
    if (next === locale) return;

    const bare = stripLocale(pathname);
    // Read at click time: `useSearchParams` would opt pages out of static rendering.
    router.replace(
      `/${next}${bare === "/" ? "" : bare}${window.location.search}` as Route,
    );
  }

  return { language: user?.language ?? null, chooseAccent, chooseLanguage };
}
