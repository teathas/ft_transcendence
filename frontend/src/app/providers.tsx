"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { routes } from "@/config/routes";
import { sessionCache } from "@/features/auth/session-cache";
import { setUnauthorizedHandler, tokenStore } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import { getQueryClient } from "@/lib/query/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const router = useRouter();

  useEffect(() => {
    // Send the user to /login once a token refresh has definitively failed.
    setUnauthorizedHandler(() => {
      tokenStore.clear();
      sessionCache.clear();
      queryClient.clear();
      router.replace(routes.login);
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient, router]);

  // Seeded after mount, not during render: the server has no localStorage, so
  // priming the cache earlier would make the first client render disagree with
  // the server's HTML.
  useEffect(() => {
    if (!tokenStore.get()) return;
    const cached = sessionCache.read();
    if (cached) {
      queryClient.setQueryData(queryKeys.auth.session(), cached);
    }
  }, [queryClient]);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
