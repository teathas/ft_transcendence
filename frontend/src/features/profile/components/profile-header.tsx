"use client";

import { CalendarDays, Mail } from "lucide-react";

import type { User } from "@/features/auth/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { AvatarUploader } from "./avatar-uploader";

export function ProfileHeader({ user }: { user: User }) {
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
          <h1 className="text-2xl font-semibold tracking-tight">
            {user.username}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                isOnline
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isOnline ? "bg-emerald-500" : "bg-muted-foreground/60",
                )}
              />
              {isOnline ? "Online" : "Offline"}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" aria-hidden="true" />
              {user.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Joined {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
