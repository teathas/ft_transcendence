"use client";

import { useState } from "react";
import { ArrowLeft, MessageCircle, TriangleAlert, UserMinus } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import { PresenceDot } from "@/components/ui/presence-dot";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { routes } from "@/config/routes";
import { useSession } from "@/features/auth/hooks/use-auth";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useFriends, usePublicProfile } from "../hooks/use-friends";
import type { PublicProfile } from "../types";
import { RemoveFriendModal } from "./remove-friend-modal";

export function PublicProfileView({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: PublicProfile;
}) {
  const d = useDict();
  const format = useFormat();
  const profile = usePublicProfile(userId, initialProfile);
  const session = useSession();
  const [confirming, setConfirming] = useState(false);

  // The profile itself says nothing about you, so the friendship (its id and
  // date) comes from your friends list, searched by this username. Signed
  // out, `/friends` would answer 401 and sign-out handling would kick in:
  // it is only asked for a signed-in visitor looking at someone else.
  const username = profile.data?.username ?? "";
  const lookup = useFriends(
    { search: username, sort: "recent", page: 1, pageSize: 50 },
    session.isAuthenticated && session.user?.id !== userId && username !== "",
  );
  const friend = lookup.data?.items.find((row) => row.user.id === userId);

  if (profile.isPending) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!profile.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10">
          <TriangleAlert className="size-5 text-amber-600" aria-hidden="true" />
        </span>
        <h1 className="font-semibold">{d.publicProfile.unavailable.title}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {d.publicProfile.unavailable.body}
        </p>
        <Link
          href={routes.friends}
          className={buttonStyles({ variant: "outline" })}
        >
          {d.publicProfile.backToPeople}
        </Link>
      </div>
    );
  }

  const user = profile.data;
  const online = user.status === "ONLINE";

  return (
    <div className="flex flex-col gap-6">
      {/* The page has no layout around it, so this is the way out: the friends
          list for a member, the home page for anyone else. */}
      <Link
        href={session.isAuthenticated ? routes.friends : routes.home}
        className={buttonStyles({
          variant: "ghost",
          className: "h-11 self-start text-muted-foreground",
        })}
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {session.isAuthenticated ? d.nav.friends : d.common.back}
      </Link>

      <article className="overflow-hidden rounded-xl border bg-card">
        <div className="h-24 bg-muted" />
        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span className="relative -mt-12 inline-block rounded-full border-4 border-card bg-card">
              <Avatar
                src={user.avatarUrl}
                name={user.username}
                className="size-24 text-3xl"
              />
              <PresenceDot
                online={online}
                className="size-5 border-4 border-card"
              />
            </span>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight">
                {user.username}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                  online
                    ? "bg-live/10 text-live"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    online ? "bg-live" : "bg-muted-foreground/60",
                  )}
                />
                {online ? d.room.online : d.room.offline}
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
              {user.bio ?? d.publicProfile.noBio}
            </p>
            {friend && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t(d.publicProfile.friendsSince, {
                  date: format.date(friend.since),
                })}
              </p>
            )}
          </div>

          {friend && (
            <div className="flex flex-col gap-2 sm:shrink-0 sm:flex-row">
              <Link
                href={routes.thread(userId)}
                aria-label={t(d.friends.actions.messageNamed, {
                  name: user.username,
                })}
                className={buttonStyles({ className: "h-11 px-5" })}
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {d.friends.actions.message}
              </Link>
              <Button
                variant="outline"
                onClick={() => setConfirming(true)}
                aria-label={t(d.friends.actions.removeNamed, {
                  name: user.username,
                })}
                className="h-11 px-5"
              >
                <UserMinus className="size-4" aria-hidden="true" />
                {d.friends.remove.confirm}
              </Button>

              <RemoveFriendModal
                friend={friend}
                open={confirming}
                onClose={() => setConfirming(false)}
              />
            </div>
          )}
        </div>
      </article>

      <section aria-labelledby="public-profile-activity">
        <h2
          id="public-profile-activity"
          className="mb-3 text-lg font-semibold"
        >
          {d.publicProfile.activity}
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label={d.publicProfile.stats.roomsJoined}
            value={user.stats.roomsJoined}
          />
          <StatTile
            label={d.publicProfile.stats.roomsOwned}
            value={user.stats.roomsOwned}
          />
          <StatTile
            label={d.publicProfile.stats.messagesSent}
            value={user.stats.messagesSent}
          />
          <StatTile
            label={d.publicProfile.stats.filesShared}
            value={user.stats.filesShared}
          />
        </div>
      </section>
    </div>
  );
}
