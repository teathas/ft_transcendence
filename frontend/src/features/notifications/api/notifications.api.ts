import { api } from "@/lib/api";
import { parseResponse } from "@/lib/api/parse";

import { notificationsPageSchema, unreadCountSchema } from "../schemas";

export const notificationsApi = {
  async list() {
    const { data } = await api.get("/notifications", {
      params: { page: 1, limit: 100 },
    });
    return parseResponse(notificationsPageSchema, data, "GET /notifications");
  },
  async unreadCount() {
    const { data } = await api.get("/notifications/unread-count");
    return parseResponse(
      unreadCountSchema,
      data,
      "GET /notifications/unread-count",
    ).count;
  },
  async markRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
  },
  async markAllRead() {
    await api.patch("/notifications/read-all");
  },
  async remove(id: string) {
    await api.delete(`/notifications/${id}`);
  },
};
