"use client";

import { useId, useState } from "react";
import { Camera, LoaderCircle } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { useUploadAvatar } from "@/features/auth/hooks/use-auth";
import { isApiError } from "@/lib/api";
import { downscaleImage, validateImageFile } from "@/lib/image";
import { cn } from "@/lib/utils";

/**
 * The avatar itself is the control: clicking it opens the file picker and the
 * upload starts straight away — no separate section, no save button.
 */
export function AvatarUploader({
  username,
  avatarUrl,
}: {
  username: string;
  avatarUrl: string | null;
}) {
  const inputId = useId();
  const uploadAvatar = useUploadAvatar();
  const [isPreparing, setIsPreparing] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const isBusy = isPreparing || uploadAvatar.isPending;

  const apiError = isApiError(uploadAvatar.error) ? uploadAvatar.error : null;
  const error = fileError ?? apiError?.message ?? null;

  async function handleFile(file: File | undefined) {
    if (!file || isBusy) return;

    const problem = validateImageFile(file);
    if (problem) {
      setFileError(problem);
      return;
    }

    setFileError(null);
    setIsPreparing(true);
    const blob = await downscaleImage(file);
    setIsPreparing(false);

    uploadAvatar.mutate({ file: blob, filename: file.name });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-fit">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          disabled={isBusy}
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="peer sr-only"
        />

        <label
          htmlFor={inputId}
          title="Change profile photo"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void handleFile(event.dataTransfer.files[0]);
          }}
          className={cn(
            "group relative block cursor-pointer rounded-full ring-4 ring-card",
            "peer-focus-visible:ring-ring peer-disabled:cursor-wait",
          )}
        >
          <Avatar
            src={avatarUrl}
            name={username}
            className="size-20 text-2xl"
          />

          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-full bg-black/55",
              "opacity-0 transition-opacity group-hover:opacity-100 peer-focus-visible:opacity-100",
              isBusy && "opacity-100",
            )}
          >
            {isBusy ? (
              <LoaderCircle
                className="size-6 animate-spin text-white"
                aria-hidden="true"
              />
            ) : (
              <Camera className="size-6 text-white" aria-hidden="true" />
            )}
          </span>

          <span className="sr-only">Change profile photo</span>
        </label>
      </div>

      {error && (
        <p role="alert" className="max-w-xs text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
