"use client";

import { TriangleAlert } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/use-auth";

import { AccountForm } from "./account-form";
import { DangerZone } from "./danger-zone";
import { PasswordForm } from "./password-form";
import { ProfileHeader } from "./profile-header";

export function ProfileView() {
  const { user, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10">
          <TriangleAlert
            className="size-5 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        </span>
        <p className="font-medium">Could not load your profile</p>
        <p className="max-w-sm text-sm text-pretty text-muted-foreground">
          Your session is not available. Sign in again to manage your account.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader user={user} />
      <AccountForm user={user} />
      <PasswordForm />
      <DangerZone username={user.username} />
    </div>
  );
}
