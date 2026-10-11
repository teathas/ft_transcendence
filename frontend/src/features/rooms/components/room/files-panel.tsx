"use client";

import { useId, useState } from "react";
import {
  Download,
  FileImage,
  FileText,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { useSession } from "@/features/auth/hooks/use-auth";
import { isApiError } from "@/lib/api";
import { env } from "@/lib/env";
import { useFormat } from "@/lib/format";
import { formatBytes } from "@/lib/image";
import { cn } from "@/lib/utils";

import {
  useDeleteRoomFile,
  useRoom,
  useRoomFiles,
  useUploadRoomFile,
} from "../../hooks/use-room";
import type { RoomFile } from "../../types";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * The API serves files as downloads under a random name. Fetching the bytes
 * and saving them gives the file its own name back.
 */
async function download(file: RoomFile) {
  if (!file.url) return;
  const response = await fetch(`${env.apiUrl}${file.url}`);
  if (!response.ok) throw new Error(String(response.status));

  const link = document.createElement("a");
  link.href = URL.createObjectURL(await response.blob());
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function FilesPanel({ roomId }: { roomId: string }) {
  const d = useDict();
  const { relativeTime } = useFormat();
  const inputId = useId();
  const { data: files, isPending } = useRoomFiles(roomId);
  const upload = useUploadRoomFile(roomId);
  const remove = useDeleteRoomFile(roomId);
  const { data: room } = useRoom(roomId);
  const { user } = useSession();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Both the drop zone and the button end up here. */
  function accept(list: FileList | null) {
    if (!list?.length) return;

    const chosen = [...list];
    const tooBig = chosen.find((file) => file.size > MAX_UPLOAD_BYTES);
    if (tooBig) {
      setError(
        t(d.room.fileTooBig, {
          name: tooBig.name,
          size: formatBytes(MAX_UPLOAD_BYTES),
        }),
      );
      return;
    }

    setError(null);
    for (const file of chosen) {
      upload.mutate(file, {
        onError: (failure) =>
          setError(isApiError(failure) ? failure.message : d.room.fileFailed),
      });
    }
  }

  function save(file: RoomFile) {
    setError(null);
    download(file).catch(() => setError(d.room.fileFailed));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      {isPending ? (
        [0, 1, 2].map((index) => <Skeleton key={index} className="h-14" />)
      ) : (
        <ul className="flex flex-col gap-2">
          {files?.map((file) => {
            const Icon = file.kind === "image" ? FileImage : FileText;

            return (
              <li
                key={file.id}
                className="flex items-center gap-1 rounded-lg border bg-card pe-1 transition-colors hover:border-primary/40"
              >
                <button
                  type="button"
                  onClick={() => save(file)}
                  disabled={!file.url}
                  aria-label={t(d.room.download, { name: file.name })}
                  className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-start"
                >
                  <Icon
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {file.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatBytes(file.sizeBytes)} · {file.uploadedBy} ·{" "}
                      {relativeTime(file.uploadedAt)}
                    </span>
                  </span>
                  <Download
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </button>

                {(file.uploaderId === user?.id || room?.ownerId === user?.id) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t(d.room.deleteFile, { name: file.name })}
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(file.id)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          accept(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-2.5 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
        )}
      >
        {upload.isPending ? (
          <LoaderCircle
            className="size-4 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <Upload className="size-4 text-muted-foreground" aria-hidden="true" />
        )}

        {/* Dragging is not always convenient, so the same action is a button.
            The native file button is hidden because it renders the browser's
            own locale strings. */}
        <input
          id={inputId}
          type="file"
          multiple
          disabled={upload.isPending}
          onChange={(event) => {
            accept(event.target.files);
            event.target.value = "";
          }}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className={cn(
            buttonStyles({ variant: "outline", size: "sm" }),
            "cursor-pointer",
            "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/40",
            "peer-disabled:pointer-events-none peer-disabled:opacity-50",
          )}
        >
          {d.room.chooseFiles}
        </label>

        <p className="text-xs text-muted-foreground">
          {t(d.room.filesDropHint, { size: formatBytes(MAX_UPLOAD_BYTES) })}
        </p>

        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
