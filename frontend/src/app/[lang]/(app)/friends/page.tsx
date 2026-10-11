import { Suspense } from "react";
import type { Metadata } from "next";

import { getDict } from "@/i18n/server";

import { Skeleton } from "@/components/ui/skeleton";
import { FriendsBrowser } from "@/features/friends/components/friends-browser";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.friends.metaTitle,
    description: d.friends.metaDescription,
  };
}

export default function FriendsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* `useUrlState` reads the query string, which needs a boundary here. */}
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <FriendsBrowser />
        </Suspense>
      </div>
    </div>
  );
}
