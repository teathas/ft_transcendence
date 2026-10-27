"use client";

import { useCallback } from "react";

import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";

import type { Notification } from "./types";

/** Where a notification leads, or undefined when it has nowhere to go. */
export function destination(notification: Notification) {
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

/** The sentence for a notification; shared by the page and the bell. */
export function useNotificationText() {
  const d = useDict();

  return useCallback(
    (notification: Notification) => {
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
    },
    [d],
  );
}
