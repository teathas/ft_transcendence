"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  useUpdateProfile,
  useUploadAvatar,
} from "@/features/auth/hooks/use-auth";
import { AvatarPicker } from "@/features/profile/components/avatar-picker";
import { useAvatarPicker } from "@/features/profile/hooks/use-avatar-picker";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";
import { downscaleImage } from "@/lib/image";

export function AvatarStep({
  username,
  currentAvatarUrl,
  onNext,
  onBack,
}: {
  username: string;
  currentAvatarUrl: string | null;
  onNext: () => void;
  onBack: () => void;
}) {
  const d = useDict();
  const picker = useAvatarPicker(currentAvatarUrl);
  const uploadAvatar = useUploadAvatar();
  const updateProfile = useUpdateProfile();
  const [isPreparing, setIsPreparing] = useState(false);

  const isBusy =
    isPreparing || uploadAvatar.isPending || updateProfile.isPending;

  const apiError = isApiError(uploadAvatar.error)
    ? uploadAvatar.error
    : isApiError(updateProfile.error)
      ? updateProfile.error
      : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;

    // Nothing new picked — keep whatever the account already has.
    if (!picker.file) {
      onNext();
      return;
    }

    setIsPreparing(true);
    const blob = await downscaleImage(picker.file);
    setIsPreparing(false);

    uploadAvatar.mutate(
      { file: blob, filename: picker.file.name },
      { onSuccess: onNext },
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {d.onboarding.avatar.title}
          </h1>
          <p className="text-pretty text-muted-foreground">
            {d.onboarding.avatar.subtitle}
          </p>
        </header>

        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{apiError.message}</AlertDescription>
          </Alert>
        )}

        <AvatarPicker
          picker={picker}
          username={username}
          disabled={isBusy}
          hasSavedAvatar={Boolean(currentAvatarUrl)}
          onRemoveSaved={() => updateProfile.mutate({ avatarUrl: null })}
        />

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            type="submit"
            size="lg"
            disabled={isBusy}
            className="sm:flex-1"
          >
            {isBusy && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {picker.file
              ? d.onboarding.avatar.saveAndContinue
              : d.common.continue}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={isBusy}
            onClick={onBack}
            className="sm:flex-none"
          >
            {d.common.back}
          </Button>
        </div>
      </div>
    </form>
  );
}
