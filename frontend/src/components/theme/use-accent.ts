"use client";

import { useCallback, useSyncExternalStore } from "react";

import { ACCENT_KEY, DEFAULT_ACCENT, type Accent } from "./accent";

const EVENT = "accent-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

// The <html> attribute is the one source of truth: the inline script set it.
const getSnapshot = () =>
  (document.documentElement.dataset.accent as Accent | undefined) ??
  DEFAULT_ACCENT;
const getServerSnapshot = () => DEFAULT_ACCENT;

export function useAccent() {
  const accent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setAccent = useCallback((next: Accent) => {
    const root = document.documentElement;
    if (next === DEFAULT_ACCENT) delete root.dataset.accent;
    else root.dataset.accent = next;
    try {
      localStorage.setItem(ACCENT_KEY, next);
    } catch {
      // Storage blocked: the choice lasts until the next page load only.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [accent, setAccent] as const;
}
