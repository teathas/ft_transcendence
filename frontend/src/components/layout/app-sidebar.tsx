"use client";

import {
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { BellLink } from "@/components/layout/bell-link";
import { BrandWordmark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useSidebarCollapsed } from "@/components/layout/use-sidebar-collapsed";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useLogout, useSession } from "@/features/auth/hooks/use-auth";
import { useFriendsSummary } from "@/features/friends/hooks/use-friends";
import { useDict } from "@/i18n/client";
import { Link, useBarePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  active,
  icon: Icon,
  label,
  onNavigate,
  badge,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onNavigate?: () => void;
  /** A count shown at the end of the row; hidden when 0. */
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={label}
      className={cn(
        "relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
        "rail-collapsed:justify-center rail-collapsed:px-0",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate rail-collapsed:sr-only">{label}</span>
      {badge ? (
        <span className="ms-auto min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[11px] leading-none font-medium text-primary-foreground tabular-nums rail-collapsed:absolute rail-collapsed:end-0.5 rail-collapsed:top-0.5 rail-collapsed:ms-0">
          {badge}
        </span>
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
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();

  return (
    <div className="flex h-full flex-col gap-6 p-4 rail-collapsed:px-3.5">
      <div className="flex items-center gap-2 rail-collapsed:flex-col rail-collapsed:gap-4">
        <Link
          href={routes.dashboard}
          onClick={onNavigate}
          className="me-auto rounded-md px-1 py-1 rail-collapsed:me-0"
        >
          <BrandWordmark labelClassName="rail-collapsed:sr-only" />
        </Link>
        <BellLink onNavigate={onNavigate} />
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
          icon={LayoutDashboard}
          label={d.nav.dashboard}
        />

        <NavLink
          href={routes.rooms}
          active={pathname === routes.rooms}
          onNavigate={onNavigate}
          icon={Presentation}
          label={d.nav.allRooms}
        />

        <NavLink
          href={routes.friends}
          active={pathname === routes.friends}
          onNavigate={onNavigate}
          badge={summary?.received}
          icon={Users}
          label={d.nav.friends}
        />

        <NavLink
          href={routes.messages}
          active={pathname.startsWith(routes.messages)}
          onNavigate={onNavigate}
          badge={summary?.unreadMessages}
          icon={MessageSquare}
          label={d.nav.messages}
        />

        <NavLink
          href={routes.profile}
          active={pathname === routes.profile}
          onNavigate={onNavigate}
          icon={UserRound}
          label={d.nav.profile}
        />
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {/* Desktop only: the phone drawer closes with its own button. */}
        {!onClose && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="app-sidebar"
            aria-label={collapsed ? d.nav.expandSidebar : d.nav.collapseSidebar}
            title={collapsed ? d.nav.expandSidebar : d.nav.collapseSidebar}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground rail-collapsed:justify-center rail-collapsed:px-0"
          >
            {/* Swapped by CSS, so the right icon shows before hydration. */}
            <PanelLeftClose
              className="size-5 shrink-0 rail-collapsed:hidden rtl:rotate-180"
              aria-hidden="true"
            />
            <PanelLeftOpen
              className="hidden size-5 shrink-0 rail-collapsed:block rtl:rotate-180"
              aria-hidden="true"
            />
            <span className="rail-collapsed:sr-only">
              {d.nav.collapseSidebar}
            </span>
          </button>
        )}

        {/* Two rows: "Se déconnecter" or "تسجيل الخروج" is wider than "Sign
            out", and three controls no longer fit on one line. */}
        <div className="flex items-center justify-between gap-2 rail-collapsed:flex-col">
          <div className="rail-collapsed:hidden">
            <ThemeToggle />
          </div>
          <div className="hidden rail-collapsed:block">
            <ThemeToggle compact />
          </div>
          <LanguageSwitcher
            side="top"
            // In the rail, open toward the page instead of off the screen edge.
            align={collapsed && !onClose ? "start" : "end"}
            className="rail-collapsed:size-11 rail-collapsed:px-0"
          />
        </div>

        <div className="flex flex-col gap-3 border-t pt-3">
          <Link
            href={routes.profile}
            onClick={onNavigate}
            title={user?.username}
            className="flex items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-accent rail-collapsed:justify-center rail-collapsed:px-0"
          >
            <Avatar
              src={user?.avatarUrl}
              name={user?.username ?? "?"}
              className="size-8"
            />
            <span className="min-w-0 flex-1 rail-collapsed:sr-only">
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
            title={d.nav.signOut}
            className="w-full justify-start rail-collapsed:size-11 rail-collapsed:justify-center rail-collapsed:px-0"
          >
            <LogOut className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            <span className="rail-collapsed:sr-only">{d.nav.signOut}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
