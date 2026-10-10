"use client";

import { useEffect } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ConnectionBanner } from "@/components/layout/connection-banner";
import { ToastProvider } from "@/components/ui/toast";
import { routes } from "@/config/routes";
import { useLocaleRouter } from "@/i18n/navigation";
import { setUnauthorizedHandler } from "@/lib/api";
import { getQueryClient } from "@/lib/query/client";
import {
  CACHE_MAX_AGE,
  CACHE_VERSION,
  persister,
  resetCache,
} from "@/lib/query/persister";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const router = useLocaleRouter();

  useEffect(() => {
    // Send the user to /login once a token refresh has definitively failed.
    setUnauthorizedHandler(() => {
      resetCache(queryClient);
      router.replace(routes.login);
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient, router]);

  return (
    <ThemeProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: CACHE_MAX_AGE,
          buster: CACHE_VERSION,
          // Everything that holds data. Not "succeeded": a refresh that failed
          // keeps its old data but is in the error state, and dropping it
          // would lose that data on the next reload.
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => query.state.data !== undefined,
          },
        }}
      >
        <ConnectionBanner />
        <ToastProvider>{children}</ToastProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
