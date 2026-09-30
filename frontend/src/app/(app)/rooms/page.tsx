import { Suspense } from "react";
import type { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";
import { RoomsBrowser } from "@/features/rooms/components/rooms-browser";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Browse, filter and open your collaborative rooms.",
};

export default function RoomsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* `useUrlState` reads the query string, which needs a boundary here. */}
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <RoomsBrowser />
        </Suspense>
      </div>
    </div>
  );
}
