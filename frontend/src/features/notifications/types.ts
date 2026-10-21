import type { z } from "zod";

import type {
  notificationSchema,
  notificationTypeSchema,
  notificationsPageSchema,
} from "./schemas";

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationsPage = z.infer<typeof notificationsPageSchema>;
