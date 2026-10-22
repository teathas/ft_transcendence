"use client";

import { useCallback, useSyncExternalStore } from "react";

import { SIDEBAR_KEY } from "./sidebar-state";

const EVENT = "sidebar-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

// The <html> attribute is the one source of truth: the inline script set it.
const getSnapshot = () =>
  document.documentElement.dataset.sidebar === "collapsed";
const getServerSnapshot = () => false;

export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.sidebar !== "collapsed";
    if (next) root.dataset.sidebar = "collapsed";
    else delete root.dataset.sidebar;
    try {
      localStorage.setItem(SIDEBAR_KEY, next ? "collapsed" : "expanded");
    } catch {
      // Storage blocked: the choice lasts until the next page load only.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [collapsed, toggle] as const;
}
