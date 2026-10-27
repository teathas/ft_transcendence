"use client";

import { CalendarDays, ExternalLink, Mail } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import type { User } from "@/features/auth/types";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import { AvatarUploader } from "./avatar-uploader";

export function ProfileHeader({ user }: { user: User }) {
  const d = useDict();
  const format = useFormat();
  const isOnline = user.status === "ONLINE";

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card">
      <div
        aria-hidden="true"
        className="h-24 bg-gradient-to-r from-primary/15 to-transparent"
      />

      <div className="flex flex-col gap-4 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-10">
          <AvatarUploader username={user.username} avatarUrl={user.avatarUrl} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {user.username}
            </h1>
            <Link
              href={routes.user(user.id)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              {d.profile.header.viewPublicProfile}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {user.bio && (
            <p className="max-w-prose text-sm text-pretty text-muted-foreground">
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                isOnline
                  ? "bg-live/10 text-live"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isOnline ? "bg-live" : "bg-muted-foreground/60",
                )}
              />
              {isOnline ? d.room.online : d.room.offline}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" aria-hidden="true" />
              {user.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {t(d.profile.header.joined, {
                date: format.date(user.createdAt),
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
