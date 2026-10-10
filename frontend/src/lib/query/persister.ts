import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { QueryClient } from "@tanstack/react-query";

/** How long a stored copy of the cache stays usable. */
export const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

/**
 * Bump this when the shape of what is cached changes. A stored copy written by
 * an older version is then thrown away instead of being rendered, since cached
 * data is not re-validated against the schemas.
 */
export const CACHE_VERSION = "1";

/** `localStorage`, or nothing where it does not exist or is blocked. */
function storage() {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Writes the whole query cache to `localStorage` so a reload can show it while
 * the server is unreachable. With no storage (the server render, a private
 * window) it does nothing.
 */
export const persister = createAsyncStoragePersister({
  storage: storage(),
  key: "query-cache",
});

/**
 * Empties the cache in memory and the stored copy. Used whenever the user
 * changes — sign-in, sign-out, a 401 — so nobody is ever shown the previous
 * user's data.
 */
export function resetCache(queryClient: QueryClient) {
  queryClient.clear();
  void persister.removeClient();
}
