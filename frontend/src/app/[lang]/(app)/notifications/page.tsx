import type { Metadata } from "next";

import { NotificationsView } from "@/features/notifications/components/notifications-view";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.notifications.metaTitle,
    description: d.notifications.description,
  };
}

export default function NotificationsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <NotificationsView />
      </div>
    </div>
  );
}
