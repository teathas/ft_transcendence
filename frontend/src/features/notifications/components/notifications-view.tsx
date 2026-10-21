"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { useDict, useLocale } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks/use-notifications";
import type { Notification } from "../types";

function destination(notification: Notification) {
  const roomId = notification.data?.roomId;
  if (typeof roomId === "string" && notification.type !== "ROOM_DELETED")
    return routes.room(roomId);
  if (notification.type.startsWith("FRIEND")) return routes.friends;
  if (notification.type.includes("DIRECT_MESSAGE")) {
    return notification.actorId
      ? routes.thread(notification.actorId)
      : routes.messages;
  }
  return undefined;
}

export function NotificationsView() {
  const d = useDict();
  const locale = useLocale();
  const query = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const remove = useDeleteNotification();

  const text = (notification: Notification) => {
    const template = d.notifications.types[notification.type];
    const actor = notification.actor?.username ?? d.notifications.someone;
    const room =
      typeof notification.data?.roomName === "string"
        ? notification.data.roomName
        : d.notifications.aRoom;
    const file =
      typeof notification.data?.fileName === "string"
        ? notification.data.fileName
        : d.notifications.aFile;
    return template
      .replace("{actor}", actor)
      .replace("{room}", room)
      .replace("{file}", file);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {d.notifications.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {d.notifications.description}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => markAll.mutate()}
          disabled={
            markAll.isPending || !query.data?.items.some((item) => !item.readAt)
          }
        >
          <CheckCheck className="size-4" aria-hidden="true" />
          {d.notifications.markAllRead}
        </Button>
      </div>

      {query.isPending ? (
        <p className="text-sm text-muted-foreground">
          {d.notifications.loading}
        </p>
      ) : null}
      {query.isError ? (
        <p className="text-sm text-destructive">{d.notifications.loadError}</p>
      ) : null}
      {query.data?.items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <Bell className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">{d.notifications.empty}</p>
          <p className="text-sm text-muted-foreground">
            {d.notifications.emptyDescription}
          </p>
        </Card>
      ) : null}

      <div className="flex flex-col gap-2">
        {query.data?.items.map((notification) => {
          const href = destination(notification);
          const content = (
            <>
              <Avatar
                src={notification.actor?.avatarUrl}
                name={notification.actor?.username ?? "?"}
                className="size-10"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {text(notification)}
                </span>
                <time
                  className="mt-1 block text-xs text-muted-foreground"
                  dateTime={notification.createdAt}
                >
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(notification.createdAt))}
                </time>
              </span>
              {!notification.readAt ? (
                <span
                  className="mt-2 size-2 rounded-full bg-primary"
                  aria-label={d.notifications.unread}
                />
              ) : null}
            </>
          );
          return (
            <Card
              key={notification.id}
              className={cn(
                "flex items-center gap-3 p-4",
                !notification.readAt && "border-primary/30 bg-primary/5",
              )}
            >
              {href ? (
                <Link
                  href={href}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-md"
                  onClick={() =>
                    !notification.readAt && markRead.mutate(notification.id)
                  }
                >
                  {content}
                </Link>
              ) : (
                <button
                  className="flex min-w-0 flex-1 items-center gap-3 text-start"
                  onClick={() =>
                    !notification.readAt && markRead.mutate(notification.id)
                  }
                >
                  {content}
                </button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label={d.notifications.delete}
                onClick={() => remove.mutate(notification.id)}
                disabled={remove.isPending}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
