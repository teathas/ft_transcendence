"use client";

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { useFriends } from "@/features/friends/hooks/use-friends";
import type { FriendsQuery } from "@/features/friends/types";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";

// The API has no "online only" filter, so the largest page it allows is
// filtered here. Past 50 friends, some online ones can be missed.
const QUERY: FriendsQuery = { search: "", page: 1, pageSize: 50, sort: "name" };

export function FriendsOnline() {
  const d = useDict();
  const { data, isPending } = useFriends(QUERY);
  const online =
    data?.items.filter((friend) => friend.user.status === "ONLINE") ?? [];

  return (
    <section className="flex flex-col rounded-xl border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-semibold tracking-tight">
          {d.dashboard.friendsOnline.title}
        </h2>
        {!isPending && (
          <span className="text-sm text-muted-foreground">
            {t(d.dashboard.friendsOnline.count, { count: online.length })}
          </span>
        )}
      </div>

      {isPending ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : online.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {d.dashboard.friendsOnline.empty}
        </p>
      ) : (
        <ul className="-mx-2 flex flex-col gap-1">
          {online.map(({ user }) => (
            <li key={user.id}>
              <Link
                href={routes.user(user.id)}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
              >
                <Avatar
                  src={user.avatarUrl}
                  name={user.username}
                  className="size-8"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {user.username}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-live" />
                    {d.room.online}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
