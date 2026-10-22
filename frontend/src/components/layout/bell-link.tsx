"use client";

import { Bell } from "lucide-react";

import { routes } from "@/config/routes";
import { useUnreadNotifications } from "@/features/notifications/hooks/use-notifications";
import { useDict } from "@/i18n/client";
import { Link, useBarePathname } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

/**
 * The way to the Notifications page; a dot, not a number, when some are
 * unread. Used by the sidebar and the room's top bar.
 */
export function BellLink({ onNavigate }: { onNavigate?: () => void }) {
  const d = useDict();
  const pathname = useBarePathname();
  const { data: unread } = useUnreadNotifications();
  const active = pathname === routes.notifications;

  return (
    <Link
      href={routes.notifications}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={
        unread
          ? t(d.nav.unreadNotifications, { count: unread })
          : d.nav.notifications
      }
      title={d.nav.notifications}
      className={cn(
        "relative inline-flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors",
        active
          ? "border-transparent bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Bell className="size-5" aria-hidden="true" />
      {unread ? (
        <span
          aria-hidden="true"
          className="absolute end-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card"
        />
      ) : null}
    </Link>
  );
}
