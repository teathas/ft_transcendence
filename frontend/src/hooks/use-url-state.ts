"use client";

import { useCallback, useMemo } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Keeps a set of string values in the query string, so a filtered, paginated
 * view can be linked, bookmarked and reloaded.
 *
 * Values equal to their default are dropped from the URL rather than written
 * out, which keeps shareable links short.
 *
 * `defaults` must be a stable reference — define it outside the component.
 */
export function useUrlState<State extends Record<string, string>>(
  defaults: State,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(() => {
    const next = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof State & string)[]) {
      const value = searchParams.get(key);
      if (value !== null) next[key] = value as State[typeof key];
    }
    return next;
  }, [searchParams, defaults]);

  const setState = useCallback(
    (patch: Partial<State>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "" || value === defaults[key]) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      const query = params.toString();
      // `replace` rather than `push`: filtering should not fill the back stack.
      router.replace((query ? `${pathname}?${query}` : pathname) as Route, {
        scroll: false,
      });
    },
    [router, pathname, searchParams, defaults],
  );

  return [state, setState] as const;
}
