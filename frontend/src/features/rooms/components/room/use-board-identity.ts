"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import type { Editor } from "tldraw";

import { useLocale } from "@/i18n/client";

/**
 * Pushes who you are onto the editor.
 *
 * This is what makes presence legible the moment a sync server is connected:
 * tldraw labels each remote cursor with the user's `name` and draws it in their
 * `color`, both read from these preferences. Without it every participant
 * shows up as an anonymous "New User".
 */
export function useBoardIdentity(
  editor: Editor | null,
  identity: { id: string; name: string; color: string },
) {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();

  // `onMount` fires once, so these are pushed from effects instead —
  // otherwise a theme switch or a rename mid-session would not reach the board.
  useEffect(() => {
    if (!editor) return;
    editor.user.updateUserPreferences({
      colorScheme: resolvedTheme === "dark" ? "dark" : "light",
    });
  }, [editor, resolvedTheme]);

  // tldraw ships its own translations for all three of our languages, Arabic
  // included, and lays its own UI out right to left from this alone. Without
  // it the board would stay English inside a fully Arabic page.
  useEffect(() => {
    if (!editor) return;
    editor.user.updateUserPreferences({ locale });
  }, [editor, locale]);

  useEffect(() => {
    if (!editor) return;
    editor.user.updateUserPreferences({
      id: identity.id,
      name: identity.name,
      color: identity.color,
    });
  }, [editor, identity.id, identity.name, identity.color]);
}

export type BoardIdentity = Parameters<typeof useBoardIdentity>[1];
