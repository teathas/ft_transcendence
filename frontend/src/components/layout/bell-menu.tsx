"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Bell } from "lucide-react";

import { routes } from "@/config/routes";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/hooks/use-notifications";
import {
  destination,
  useNotificationText,
} from "@/features/notifications/notification-text";
import type {
  Notification,
  NotificationType,
} from "@/features/notifications/types";
import { useDict } from "@/i18n/client";
import { Link, useBarePathname } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The bell only carries what is about you. Room chat creates one notification
 * per message per member, and it belongs on the room, not here.
 */
const BELL_TYPES: readonly NotificationType[] = [
  "FRIEND_REQUEST",
  "FRIEND_REQUEST_ACCEPTED",
  "NEW_DIRECT_MESSAGE",
];
const SHOWN = 6;

/**
 * The bell and its panel. The API cannot filter by type, so this filters the
 * latest 100 itself: a very busy room can push older personal items out of
 * that window. The Notifications page still lists everything.
 *
 * `sidebar` anchors the panel to the sidebar's top row (which must be
 * `relative`), so it starts at the sidebar's edge rather than at the bell.
 * `bar` anchors it under the bell; on phones it spans the screen instead.
 */
export function BellMenu({
  placement,
  onNavigate,
}: {
  placement: "sidebar" | "bar";
  onNavigate?: () => void;
}) {
  const d = useDict();
  const format = useFormat();
  const text = useNotificationText();
  const pathname = useBarePathname();
  const query = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  const mine = (query.data?.items ?? []).filter((notification) =>
    BELL_TYPES.includes(notification.type),
  );
  const unread = mine.filter((notification) => !notification.readAt).length;
  const active = pathname === routes.notifications;

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  /** Reading an item marks it read; following it also leaves the panel. */
  const choose = (notification: Notification) => {
    if (!notification.readAt) markRead.mutate(notification.id);
    if (destination(notification)) {
      setIsOpen(false);
      onNavigate?.();
    }
  };

  const label = unread
    ? t(d.nav.unreadNotifications, { count: unread > 99 ? "99+" : unread })
    : d.nav.notifications;

  return (
    <div ref={rootRef} className={cn(placement === "bar" && "relative")}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={label}
        title={d.nav.notifications}
        className={cn(
          "relative inline-flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors",
          active || isOpen
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
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(
            "z-50 w-[min(21.5rem,calc(100vw-2rem))] overflow-hidden rounded-xl border bg-card text-start shadow-lg shadow-black/5 outline-none dark:shadow-black/40",
            placement === "sidebar"
              ? "absolute start-0 top-full mt-2"
              : "fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:mt-2",
          )}
        >
          <div className="flex items-center justify-between gap-2 ps-4 pe-2">
            <h2 id={titleId} className="text-sm font-semibold">
              {d.notifications.title}
            </h2>
            <button
              type="button"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending || unread === 0}
              className="min-h-11 rounded-md px-2 text-sm text-primary transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
            >
              {d.notifications.markAllRead}
            </button>
          </div>

          {query.isPending ? (
            <p className="border-t px-4 py-3 text-sm text-muted-foreground">
              {d.notifications.loading}
            </p>
          ) : query.isError ? (
            <p className="border-t px-4 py-3 text-sm text-destructive">
              {d.notifications.loadError}
            </p>
          ) : mine.length === 0 ? (
            <p className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
              {d.notifications.empty}
            </p>
          ) : (
            <ul>
              {mine.slice(0, SHOWN).map((notification) => {
                const href = destination(notification);
                const itemClass =
                  "flex min-h-11 w-full items-start gap-3 border-t px-4 py-3 text-start transition-colors hover:bg-accent";
                const content = (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        notification.readAt ? "bg-transparent" : "bg-primary",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      {!notification.readAt && (
                        <span className="sr-only">
                          {d.notifications.unread}:{" "}
                        </span>
                      )}
                      <span className="block text-sm">{text(notification)}</span>
                      <time
                        dateTime={notification.createdAt}
                        className="mt-0.5 block text-xs text-muted-foreground"
                      >
                        {format.relativeTime(notification.createdAt)}
                      </time>
                    </span>
                  </>
                );

                return (
                  <li key={notification.id}>
                    {href ? (
                      <Link
                        href={href}
                        onClick={() => choose(notification)}
                        className={itemClass}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => choose(notification)}
                        className={itemClass}
                      >
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href={routes.notifications}
            onClick={() => {
              setIsOpen(false);
              onNavigate?.();
            }}
            className="flex min-h-11 items-center justify-center border-t text-sm text-primary transition-colors hover:bg-accent"
          >
            {d.notifications.seeAll}
          </Link>
        </div>
      )}
    </div>
  );
}
