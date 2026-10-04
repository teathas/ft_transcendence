"use client";

import { useId } from "react";
import { ImageUp, Trash2, Upload } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { formatBytes, MAX_IMAGE_BYTES } from "@/lib/image";
import { cn } from "@/lib/utils";

import type { AvatarPicker as Picker } from "../hooks/use-avatar-picker";

export function AvatarPicker({
  picker,
  username,
  disabled = false,
  hasSavedAvatar = false,
  onRemoveSaved,
  label = "Photo",
}: {
  picker: Picker;
  username: string;
  disabled?: boolean;
  hasSavedAvatar?: boolean;
  onRemoveSaved?: () => void;
  label?: string;
}) {
  const inputId = useId();
  const canRemove = picker.hasPick || (hasSavedAvatar && onRemoveSaved);

  return (
    <div className="flex flex-col gap-3">
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          picker.select(event.dataTransfer.files[0]);
        }}
        className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-card p-6 text-center"
      >
        <Avatar
          src={picker.shownAvatar}
          name={username}
          className="size-20 text-xl"
        />

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium">{username}</p>
          <p className="text-xs text-muted-foreground">
            {picker.file
              ? `${picker.file.name} · ${formatBytes(picker.file.size)}`
              : picker.shownAvatar
                ? "Using your current photo"
                : "Using your initials"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          {/* The native file button renders the browser's own locale strings
              ("Choisir un fichier"), so it is hidden and replaced by a label we
              word ourselves. The input stays focusable for keyboard users. */}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={(event) => picker.select(event.target.files?.[0])}
            aria-describedby={`${inputId}-hint`}
            className="peer sr-only"
          />
          <label
            htmlFor={inputId}
            className={cn(
              buttonStyles({ size: "sm" }),
              "cursor-pointer",
              "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/40",
              "peer-disabled:pointer-events-none peer-disabled:opacity-50",
            )}
          >
            <Upload className="size-3.5" aria-hidden="true" />
            {picker.hasPick ? "Choose another photo" : "Choose a photo"}
          </label>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ImageUp className="size-3.5" aria-hidden="true" />
            or drop an image here
          </p>
        </div>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() =>
              picker.hasPick ? picker.clear() : onRemoveSaved?.()
            }
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            {picker.hasPick ? "Remove selection" : "Remove photo"}
          </Button>
        )}
      </div>

      <FieldDescription id={`${inputId}-hint`}>
        Optional. PNG, JPG or WebP up to {formatBytes(MAX_IMAGE_BYTES)} — large
        images are shrunk before upload.
      </FieldDescription>

      <FieldError messages={picker.error ? [picker.error] : undefined} />
    </div>
  );
}
