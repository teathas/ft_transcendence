"use client";

import { useSyncExternalStore } from "react";

import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { tokenStore } from "@/lib/api";

/**
 * The landing header is rendered on the server, which cannot know who is
 * signed in (the token lives in the browser). This small piece decides on the
 * client: "Dashboard" for someone signed in, "Sign in" for everyone else.
 */
export function HeaderAuthLink() {
  const d = useDict();
  const token = useSyncExternalStore(
    tokenStore.subscribe,
    tokenStore.get,
    () => null,
  );

  return (
    <Link
      href={token ? routes.dashboard : routes.login}
      className={buttonStyles({
        variant: "ghost",
        size: "sm",
        // Signed in, it is the way back to the app: keep it on phones too.
        className: token ? undefined : "hidden sm:inline-flex",
      })}
    >
      {token ? d.nav.dashboard : d.landing.header.signIn}
    </Link>
  );
}
