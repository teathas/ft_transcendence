"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { routes } from "@/config/routes";
import { useLocaleRouter } from "@/i18n/navigation";
import { setUnauthorizedHandler } from "@/lib/api";
import { getQueryClient } from "@/lib/query/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const router = useLocaleRouter();

  useEffect(() => {
    // Send the user to /login once a token refresh has definitively failed.
    setUnauthorizedHandler(() => {
      queryClient.clear();
      router.replace(routes.login);
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient, router]);

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
