import type { Metadata } from "next";

import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your recent rooms and collaboration activity.",
};

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <DashboardView />
      </div>
    </div>
  );
}
