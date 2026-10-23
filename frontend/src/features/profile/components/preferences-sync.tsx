"use client";

import { useEffect } from "react";

import { DEFAULT_ACCENT } from "@/components/theme/accent";
import { applyAccent } from "@/components/theme/use-accent";
import { useSession } from "@/features/auth/hooks/use-auth";

/**
 * Brings the account's accent onto this device (a new browser, a new login):
 * the saved one, or the default when none is saved. Renders nothing.
 */
export function PreferencesSync() {
  const { user } = useSession();
  const userId = user?.id;
  const accent = user?.accentColor ?? DEFAULT_ACCENT;

  useEffect(() => {
    if (userId) applyAccent(accent);
  }, [userId, accent]);

  return null;
}
