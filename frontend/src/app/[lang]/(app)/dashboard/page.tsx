import type { Metadata } from "next";

import { getDict } from "@/i18n/server";

import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.dashboard.metaTitle,
    description: d.dashboard.metaDescription,
  };
}

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <DashboardView />
      </div>
    </div>
  );
}
