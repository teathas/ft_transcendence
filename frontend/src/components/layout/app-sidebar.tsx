"use client";

import { LayoutGrid, LogOut, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandWordmark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { useLogout, useSession } from "@/features/auth/hooks/use-auth";
import { useRooms } from "@/features/rooms/hooks/use-rooms";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  active,
  children,
  onNavigate,
}: {
  href: React.ComponentProps<typeof Link>["href"];
  active: boolean;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useSession();
  const logout = useLogout();
  const { data: rooms, isPending } = useRooms();

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        href={routes.rooms}
        onClick={onNavigate}
        className="rounded-md px-1 py-1"
      >
        <BrandWordmark />
      </Link>

      <Link
        href={routes.rooms}
        onClick={onNavigate}
        className={buttonStyles({ className: "w-full" })}
      >
        <Plus className="size-4" aria-hidden="true" />
        New room
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Main">
        <NavLink
          href={routes.rooms}
          active={pathname === routes.rooms}
          onNavigate={onNavigate}
        >
          <LayoutGrid className="size-4" aria-hidden="true" />
          All rooms
        </NavLink>

        <NavLink
          href={routes.profile}
          active={pathname === routes.profile}
          onNavigate={onNavigate}
        >
          <UserRound className="size-4" aria-hidden="true" />
          Profile
        </NavLink>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Recent
        </p>

        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {isPending &&
            [0, 1, 2].map((index) => (
              <Skeleton key={index} className="mx-1 h-8" />
            ))}

          {rooms?.slice(0, 6).map((room) => (
            <NavLink
              key={room.id}
              href={routes.room(room.code)}
              active={pathname === routes.room(room.code)}
              onNavigate={onNavigate}
            >
              <span className="truncate">{room.name}</span>
            </NavLink>
          ))}

          {rooms?.length === 0 && (
            <p className="px-3 text-sm text-muted-foreground">No rooms yet.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t pt-4">
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
              {user?.username ?? "Signed out"}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {user?.email ?? "No session"}
            </span>
          </span>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
