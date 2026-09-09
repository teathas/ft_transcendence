import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query";

import { isApiError } from "@/lib/api/errors";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Long enough that hydrated server data is not refetched on mount.
        staleTime: 60_000,
        gcTime: 5 * 60_000,
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
