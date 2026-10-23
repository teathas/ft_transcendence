"use client";

import { useSyncExternalStore } from "react";

import { ACCENT_KEY, DEFAULT_ACCENT, isAccent, type Accent } from "./accent";

const EVENT = "accent-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

// The <html> attribute is the one source of truth: prefs-init.js set it.
const getSnapshot = (): Accent => {
  const saved = document.documentElement.dataset.accent;
  return isAccent(saved) ? saved : DEFAULT_ACCENT;
};
const getServerSnapshot = () => DEFAULT_ACCENT;

/** Applies an accent to the page and remembers it on this device. */
export function applyAccent(accent: Accent) {
  document.documentElement.dataset.accent = accent;
  try {
    localStorage.setItem(ACCENT_KEY, accent);
  } catch {
    // Storage blocked: the choice lasts until the next page load only.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useAccent() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
