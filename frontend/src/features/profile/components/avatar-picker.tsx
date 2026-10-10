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
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { formatBytes, MAX_IMAGE_BYTES } from "@/lib/image";
import { cn } from "@/lib/utils";

import type { AvatarPicker as Picker } from "../hooks/use-avatar-picker";

export function AvatarPicker({
  picker,
  username,
  disabled = false,
  hasSavedAvatar = false,
  onRemoveSaved,
  label,
}: {
  picker: Picker;
  username: string;
  disabled?: boolean;
  hasSavedAvatar?: boolean;
  onRemoveSaved?: () => void;
  label?: string;
}) {
  const d = useDict();
  const inputId = useId();
  const canRemove = picker.hasPick || (hasSavedAvatar && onRemoveSaved);

  return (
    <div className="flex flex-col gap-3">
      <FieldLabel htmlFor={inputId}>
        {label ?? d.profile.picker.label}
      </FieldLabel>

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
                ? d.profile.picker.usingCurrent
                : d.profile.picker.usingInitials}
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
            {picker.hasPick
              ? d.profile.picker.chooseAnother
              : d.profile.picker.choose}
          </label>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ImageUp className="size-3.5" aria-hidden="true" />
            {d.profile.picker.dropHint}
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
            {picker.hasPick
              ? d.profile.picker.removeSelection
              : d.profile.picker.removePhoto}
          </Button>
        )}
      </div>

      <FieldDescription id={`${inputId}-hint`}>
        {t(d.profile.picker.hint, { size: formatBytes(MAX_IMAGE_BYTES) })}
      </FieldDescription>

      <FieldError messages={picker.error ? [picker.error] : undefined} />
    </div>
  );
}
