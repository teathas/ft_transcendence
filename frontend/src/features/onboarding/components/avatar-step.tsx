"use client";

import { useEffect, useId, useState } from "react";
import { ImageUp, LoaderCircle, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  useUpdateProfile,
  useUploadAvatar,
} from "@/features/auth/hooks/use-auth";
import { isApiError } from "@/lib/api";
import {
  downscaleImage,
  formatBytes,
  MAX_IMAGE_BYTES,
  validateImageFile,
} from "@/lib/image";
import { cn } from "@/lib/utils";

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
  const inputId = useId();
  const uploadAvatar = useUploadAvatar();
  const updateProfile = useUpdateProfile();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Each preview holds a blob in memory until it is revoked. The cleanup runs
  // on the previous URL whenever a new one replaces it.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const isBusy =
    isPreparing || uploadAvatar.isPending || updateProfile.isPending;

  const apiError = isApiError(uploadAvatar.error)
    ? uploadAvatar.error
    : isApiError(updateProfile.error)
      ? updateProfile.error
      : null;

  function selectFile(next: File | undefined) {
    if (!next) return;

    const problem = validateImageFile(next);
    if (problem) {
      setFileError(problem);
      return;
    }

    setFileError(null);
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  }

  function clearSelection() {
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;

    // Nothing new picked — keep whatever the account already has.
    if (!file) {
      onNext();
      return;
    }

    setIsPreparing(true);
    const blob = await downscaleImage(file);
    setIsPreparing(false);

    uploadAvatar.mutate(
      { file: blob, filename: file.name },
      { onSuccess: onNext },
    );
  }

  const shownAvatar = previewUrl ?? currentAvatarUrl;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Pick a picture
          </h1>
          <p className="text-pretty text-muted-foreground">
            It shows next to your cursor on the board, so people know who is
            drawing. You can skip this and add one later.
          </p>
        </header>

        {apiError && !apiError.fieldErrors && (
          <Alert variant="destructive">
            <AlertDescription>{apiError.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3">
          <FieldLabel htmlFor={inputId}>Photo</FieldLabel>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              selectFile(event.dataTransfer.files[0]);
            }}
            className={cn(
              "flex flex-col items-center gap-4 rounded-xl border border-dashed bg-card p-6 text-center transition-colors",
              isDragging && "border-primary bg-primary/5",
            )}
          >
            <Avatar
              src={shownAvatar}
              name={username}
              className="size-20 text-xl"
            />

            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-muted-foreground">
                {file
                  ? `${file.name} · ${formatBytes(file.size)}`
                  : shownAvatar
                    ? "Using your current photo"
                    : "Using your initials"}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <input
                id={inputId}
                type="file"
                accept="image/*"
                disabled={isBusy}
                onChange={(event) => selectFile(event.target.files?.[0])}
                aria-describedby={`${inputId}-hint`}
                className={cn(
                  "max-w-full text-xs text-muted-foreground",
                  "file:mr-3 file:cursor-pointer file:bg-primary file:text-primary-foreground",
                  "file:rounded-md file:border-0 file:px-3 file:py-2 file:text-sm file:font-medium",
                  "file:transition-colors hover:file:bg-primary/90",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              />

              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ImageUp className="size-3.5" aria-hidden="true" />
                or drop an image here
              </p>
            </div>

            {(file || currentAvatarUrl) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isBusy}
                onClick={() => {
                  if (file) {
                    clearSelection();
                    return;
                  }
                  // Already saved on the account — ask the API to drop it.
                  updateProfile.mutate({ avatarUrl: null });
                }}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                {file ? "Remove selection" : "Remove photo"}
              </Button>
            )}
          </div>

          <FieldDescription id={`${inputId}-hint`}>
            Optional. PNG, JPG or WebP up to {formatBytes(MAX_IMAGE_BYTES)} —
            large images are shrunk before upload.
          </FieldDescription>

          <FieldError messages={fileError ? [fileError] : undefined} />
        </div>

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
            {file ? "Save and continue" : "Continue"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={isBusy}
            onClick={onBack}
            className="sm:flex-none"
          >
            Back
          </Button>
        </div>
      </div>
    </form>
  );
}
