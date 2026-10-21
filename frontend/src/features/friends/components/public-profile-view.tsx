"use client";

import {
  ArrowLeft,
  Crown,
  FileUp,
  MessageSquareText,
  TriangleAlert,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { PresenceDot } from "@/components/ui/presence-dot";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { usePublicProfile } from "../hooks/use-friends";
import type { PublicProfile } from "../types";

export function PublicProfileView({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: PublicProfile;
}) {
  const d = useDict();
  const profile = usePublicProfile(userId, initialProfile);

  if (profile.isPending) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-80 rounded-2xl" />
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
    <div className="flex flex-col gap-5">
      <Link
        href={routes.friends}
        className={buttonStyles({
          variant: "ghost",
          size: "sm",
          className: "self-start",
        })}
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {d.publicProfile.back}
      </Link>

      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="h-32 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent" />
        <div className="flex flex-col items-center px-6 pb-8 text-center sm:px-10">
          <span className="relative -mt-16 rounded-full border-4 border-card bg-card">
            <Avatar
              src={user.avatarUrl}
              name={user.username}
              className="size-32 text-4xl"
            />
            <PresenceDot
              online={online}
              className="size-5 border-4 border-card"
            />
          </span>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {user.username}
          </h1>
          <span
            className={cn(
              "mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
              online
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                online ? "bg-emerald-500" : "bg-muted-foreground/60",
              )}
            />
            {online ? d.room.online : d.room.offline}
          </span>

          <div className="mt-8 w-full max-w-xl rounded-xl bg-muted/50 p-5 text-start">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium">
              <UserRound className="size-4 text-primary" aria-hidden="true" />
              {d.publicProfile.about}
            </p>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              {user.bio ?? d.publicProfile.noBio}
            </p>
          </div>

          <section
            className="mt-8 w-full text-start"
            aria-labelledby="public-profile-activity"
          >
            <h2
              id="public-profile-activity"
              className="mb-3 text-lg font-semibold"
            >
              {d.publicProfile.activity}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatTile
                label={d.publicProfile.stats.roomsJoined}
                value={user.stats.roomsJoined}
                icon={UsersRound}
                accent="primary"
              />
              <StatTile
                label={d.publicProfile.stats.roomsOwned}
                value={user.stats.roomsOwned}
                icon={Crown}
                accent="amber"
              />
              <StatTile
                label={d.publicProfile.stats.messagesSent}
                value={user.stats.messagesSent}
                icon={MessageSquareText}
                accent="emerald"
              />
              <StatTile
                label={d.publicProfile.stats.filesShared}
                value={user.stats.filesShared}
                icon={FileUp}
                accent="sky"
              />
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
