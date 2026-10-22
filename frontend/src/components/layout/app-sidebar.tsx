"use client";

import {
  Bell,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Presentation,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { BrandWordmark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useLogout, useSession } from "@/features/auth/hooks/use-auth";
import { useFriendsSummary } from "@/features/friends/hooks/use-friends";
import { useUnreadNotifications } from "@/features/notifications/hooks/use-notifications";
import { useDict } from "@/i18n/client";
import { Link, useBarePathname } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  active,
  children,
  onNavigate,
  badge,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate?: () => void;
  /** A count shown at the end of the row; hidden when 0. */
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
      {badge ? (
        <span className="ms-auto min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[11px] leading-none font-medium text-primary-foreground tabular-nums">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

/** The way to the Notifications page; a dot, not a number, when some are unread. */
function BellLink({
  active,
  unread,
  onNavigate,
}: {
  active: boolean;
  unread?: number;
  onNavigate?: () => void;
}) {
  const d = useDict();

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

export function AppSidebar({
  onNavigate,
  onClose,
}: {
  onNavigate?: () => void;
  /** Only the phone drawer passes it: its close button shares the top row. */
  onClose?: () => void;
}) {
  const d = useDict();
  // Compared against `routes.*`, which carry no locale, so the prefix has to go.
  const pathname = useBarePathname();
  const { user } = useSession();
  const logout = useLogout();
  const { data: summary } = useFriendsSummary();
  const { data: unreadNotifications } = useUnreadNotifications();

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2">
        <Link
          href={routes.dashboard}
          onClick={onNavigate}
          className="me-auto rounded-md px-1 py-1"
        >
          <BrandWordmark />
        </Link>
        <BellLink
          active={pathname === routes.notifications}
          unread={unreadNotifications}
          onNavigate={onNavigate}
        />
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={d.nav.closeNavigation}
            onClick={onClose}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <nav className="flex flex-col gap-1" aria-label={d.nav.main}>
        <NavLink
          href={routes.dashboard}
          active={pathname === routes.dashboard}
          onNavigate={onNavigate}
        >
          <LayoutDashboard className="size-5" aria-hidden="true" />
          {d.nav.dashboard}
        </NavLink>

        <NavLink
          href={routes.rooms}
          active={pathname === routes.rooms}
          onNavigate={onNavigate}
        >
          <Presentation className="size-5" aria-hidden="true" />
          {d.nav.allRooms}
        </NavLink>

        <NavLink
          href={routes.friends}
          active={pathname === routes.friends}
          onNavigate={onNavigate}
          badge={summary?.received}
        >
          <Users className="size-5" aria-hidden="true" />
          {d.nav.friends}
        </NavLink>

        <NavLink
          href={routes.messages}
          active={pathname.startsWith(routes.messages)}
          onNavigate={onNavigate}
          badge={summary?.unreadMessages}
        >
          <MessageSquare className="size-5" aria-hidden="true" />
          {d.nav.messages}
        </NavLink>

        <NavLink
          href={routes.profile}
          active={pathname === routes.profile}
          onNavigate={onNavigate}
        >
          <UserRound className="size-5" aria-hidden="true" />
          {d.nav.profile}
        </NavLink>
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {/* Two rows: "Se déconnecter" or "تسجيل الخروج" is wider than "Sign
            out", and three controls no longer fit on one line. */}
        <div className="flex items-center justify-between gap-2">
          <ThemeToggle />
          <LanguageSwitcher side="top" />
        </div>

        <div className="flex flex-col gap-3 border-t pt-3">
          <Link
            href={routes.profile}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-accent"
          >
            <Avatar
              src={user?.avatarUrl}
              name={user?.username ?? "?"}
              className="size-8"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {user?.username ?? d.nav.signedOut}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user?.email ?? d.nav.noSession}
              </span>
            </span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="w-full justify-start"
          >
            <LogOut className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            {d.nav.signOut}
          </Button>
        </div>
      </div>
    </div>
  );
}
