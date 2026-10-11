import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query";

import { isApiError } from "@/lib/api/errors";

import { CACHE_MAX_AGE } from "./persister";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Always ask the server again when a page mounts. The cached copy is
        // still shown while it loads, but it is never trusted as fresh.
        staleTime: 0,
        // As long as the stored copy: an entry dropped from memory could not
        // be saved, so it would be missing after a reload.
        gcTime: CACHE_MAX_AGE,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Retrying a 404 or a 401 only delays the error the user must see.
          if (isApiError(error) && error.isClientError) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        // Lets Server Components stream pending queries to the client.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * A fresh client per server render keeps requests from leaking between users;
 * one shared client in the browser preserves the cache across renders.
 */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
