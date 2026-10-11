"use client";

import { useEffect, useSyncExternalStore } from "react";
import { LoaderCircle } from "lucide-react";

import { routes } from "@/config/routes";
import { useLocaleRouter } from "@/i18n/navigation";
import { tokenStore } from "@/lib/api";

/**
 * The token as the browser has it, kept in step with `tokenStore`.
 *
 * The server has no `localStorage`, so there it is always `null`; the real
 * value appears on the first client render. That is why these guards run in the
 * browser, and why the effects below read `tokenStore.get()` directly: during
 * hydration the hook still reports the server's `null`.
 */
function useToken() {
  return useSyncExternalStore(tokenStore.subscribe, tokenStore.get, () => null);
}

/**
 * Wraps every private page. Without a token nothing of the page is rendered and
 * the visitor is sent to the login.
 *
 * It sits in the layout, so it runs whenever a private route is rendered —
 * typing the address, a link, `router.push`, the back button — and again when
 * the token disappears (sign-out, a 401).
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useToken();
  const router = useLocaleRouter();

  useEffect(() => {
    if (!tokenStore.get()) router.replace(routes.login);
  }, [token, router]);

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <LoaderCircle
          className="size-6 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  return children;
}

/** Wraps login and register: someone already signed in is sent to the dashboard. */
export function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useToken();
  const router = useLocaleRouter();

  useEffect(() => {
    if (tokenStore.get()) router.replace(routes.dashboard);
  }, [token, router]);

  return token ? null : children;
}
