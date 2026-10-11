"use client";

import { useId, useState } from "react";
import {
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/use-auth";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
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

const KIND_STYLE = {
  pdf: { icon: FileText, tile: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  image: { icon: ImageIcon, tile: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  document: { icon: FileIcon, tile: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
} as const;

/** Where a file's bytes are, or nothing for mock files that have no address. */
const urlOf = (file: RoomFile) => (file.url ? `${env.apiUrl}${file.url}` : null);

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

  /** The button and the drop zone both end up here. */
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
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        // Moving over a child fires leave on the parent; only the exit counts.
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        accept(event.dataTransfer.files);
      }}
      className="relative flex min-h-0 flex-1 flex-col"
    >
      <div className="shrink-0 border-b p-3">
        {/* The native file button renders the browser's own locale strings, so
            it is hidden and a styled label opens it. */}
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
            buttonStyles({ variant: "primary", size: "md", className: "w-full cursor-pointer" }),
            "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/40",
            "peer-disabled:pointer-events-none peer-disabled:opacity-50",
          )}
        >
          {upload.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="size-4" aria-hidden="true" />
          )}
          {d.room.uploadFiles}
        </label>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {t(d.room.filesDropHint, { size: formatBytes(MAX_UPLOAD_BYTES) })}
        </p>
        {error && (
          <p role="alert" className="mt-2 text-center text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {isPending ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : !files?.length ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <p className="font-medium">{d.room.filesEmpty.title}</p>
            <p className="text-sm text-pretty text-muted-foreground">
              {d.room.filesEmpty.body}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {files.map((file) => {
              const { icon: Icon, tile } = KIND_STYLE[file.kind];
              const src = urlOf(file);
              const canDelete =
                file.uploaderId === user?.id || room?.ownerId === user?.id;

              return (
                <li
                  key={file.id}
                  className="flex items-center gap-1 rounded-xl border bg-card p-2 transition-colors hover:border-primary/40"
                >
                  <button
                    type="button"
                    onClick={() => save(file)}
                    disabled={!file.url}
                    aria-label={t(d.room.download, { name: file.name })}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start"
                  >
                    {file.kind === "image" && src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="size-11 shrink-0 rounded-lg border object-cover"
                      />
                    ) : (
                      <span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-lg",
                          tile,
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    )}

                    <span className="min-w-0 flex-1">
                      <span
                        title={file.name}
                        className="block truncate text-sm font-medium"
                      >
                        {file.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {formatBytes(file.sizeBytes)} · {file.uploadedBy} ·{" "}
                        {relativeTime(file.uploadedAt)}
                      </span>
                    </span>

                    <Download
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </button>

                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t(d.room.deleteFile, { name: file.name })}
                      disabled={remove.isPending}
                      onClick={() => remove.mutate(file.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Over the whole panel while a file is being dragged in. */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-2 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-[2px]">
          <Upload className="size-6 text-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-primary">{d.room.dropFiles}</p>
        </div>
      )}
    </div>
  );
}
