"use client";

import { useId, useState } from "react";
import {
  Download,
  Eye,
  File as FileIcon,
  FileText,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/use-auth";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { isApiError } from "@/lib/api";
import { useFormat } from "@/lib/format";
import { formatBytes } from "@/lib/image";
import { cn } from "@/lib/utils";

import {
  useDeleteRoomFile,
  useRoom,
  useRoomFiles,
  useUploadRoomFile,
} from "../../hooks/use-room";
import { fetchRoomFile, useBlobUrl } from "../../file-blob";
import type { RoomFile } from "../../types";
import { DeleteFileModal } from "./delete-file-modal";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".txt",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
] as const;
const FILE_ACCEPT = ALLOWED_EXTENSIONS.join(",");

/**
 * The API serves files as downloads under a random name. Fetching the bytes
 * and saving them gives the file its own name back.
 */
async function download(file: RoomFile) {
  if (!file.url) throw new Error("Missing file URL");
  const blob = await fetchRoomFile(file.url);

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = file.name;
  link.click();
  // Revoked right away, some browsers would cancel the save.
  setTimeout(() => URL.revokeObjectURL(link.href), 10_000);
}

/** "PDF", "PNG", "DOCX": the tile's label, from the name's extension. */
function typeLabel(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1, dot + 5).toUpperCase() : "";
}

/** The browser can show these itself; other types can only be downloaded. */
const canPreview = (file: RoomFile) =>
  file.kind === "pdf" || file.kind === "image";

/** The tile before the name: the picture itself for an image, else its type. */
function FileTile({ file, onOpen }: { file: RoomFile; onOpen: () => void }) {
  const d = useDict();
  const src = useBlobUrl(file.kind === "image" ? file.url : undefined);

  if (src) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t(d.room.previewFile, { name: file.name })}
        className="size-12 shrink-0 overflow-hidden rounded-lg border bg-muted"
      >
        {/* A blob: address cannot go through next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="size-full object-cover" />
      </button>
    );
  }

  const label = typeLabel(file.name);
  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-semibold text-muted-foreground"
    >
      {label || <FileIcon className="size-4" />}
    </span>
  );
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [preview, setPreview] = useState<RoomFile | null>(null);
  const [deleting, setDeleting] = useState<RoomFile | null>(null);
  const previewUrl = useBlobUrl(preview?.url);

  /** The button and the drop zone both end up here. */
  async function accept(list: FileList | null) {
    if (!list?.length) return;

    const chosen = [...list];
    const unsupported = chosen.find((file) => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      return !ALLOWED_EXTENSIONS.some((allowed) => allowed === extension);
    });
    if (unsupported) {
      setError(t(d.room.fileTypeNotAllowed, { name: unsupported.name }));
      return;
    }
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
    try {
      for (const file of chosen) {
        setUploadingName(file.name);
        setUploadProgress(0);
        await upload.mutateAsync({ file, onProgress: setUploadProgress });
      }
    } catch (failure) {
      setError(isApiError(failure) ? failure.message : d.room.fileFailed);
    } finally {
      setUploadProgress(null);
      setUploadingName(null);
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
        void accept(event.dataTransfer.files);
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
          accept={FILE_ACCEPT}
          disabled={upload.isPending}
          onChange={(event) => {
            void accept(event.target.files);
            event.target.value = "";
          }}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className={cn(
            buttonStyles({
              variant: "primary",
              size: "md",
              className: "h-11 w-full cursor-pointer",
            }),
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
        {uploadProgress !== null && (
          <div className="mt-3" aria-live="polite">
            <div className="mb-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="truncate">{uploadingName}</span>
              <span className="shrink-0 tabular-nums">{uploadProgress}%</span>
            </div>
            <div
              role="progressbar"
              aria-label={d.room.uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={uploadProgress}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
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
              const canDelete =
                file.uploaderId === user?.id || room?.ownerId === user?.id;

              return (
                <li
                  key={file.id}
                  className="flex items-center gap-3 rounded-xl border bg-card p-3"
                >
                  <FileTile file={file} onOpen={() => setPreview(file)} />

                  <span className="min-w-0 flex-1">
                    <span
                      dir="auto"
                      title={file.name}
                      className="line-clamp-2 text-sm font-medium [overflow-wrap:anywhere]"
                    >
                      {file.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatBytes(file.sizeBytes)} ·{" "}
                      <bdi>{file.uploadedBy}</bdi> ·{" "}
                      {relativeTime(file.uploadedAt)}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center">
                    {canPreview(file) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t(d.room.previewFile, { name: file.name })}
                        title={t(d.room.previewFile, { name: file.name })}
                        disabled={!file.url}
                        onClick={() => setPreview(file)}
                        className="size-11 text-muted-foreground"
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t(d.room.download, { name: file.name })}
                      title={t(d.room.download, { name: file.name })}
                      disabled={!file.url}
                      onClick={() => save(file)}
                      className="size-11 text-muted-foreground"
                    >
                      <Download className="size-4" aria-hidden="true" />
                    </Button>

                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t(d.room.deleteFile, { name: file.name })}
                        title={t(d.room.deleteFile, { name: file.name })}
                        disabled={remove.isPending}
                        onClick={() => setDeleting(file)}
                        className="size-11 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    )}
                  </span>
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

      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={preview?.name ?? d.room.pdfPreview}
        className="max-w-5xl"
      >
        {preview &&
          (previewUrl ? (
            preview.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={preview.name}
                className="mx-auto max-h-[70vh] w-auto rounded-lg border"
              />
            ) : (
              <iframe
                src={previewUrl}
                title={preview.name}
                className="h-[70vh] w-full rounded-lg border bg-white"
              />
            )
          ) : (
            <Skeleton className="h-[70vh] w-full rounded-lg" />
          ))}
      </Modal>

      <DeleteFileModal
        name={deleting?.name ?? null}
        pending={remove.isPending}
        error={remove.error}
        onClose={() => {
          if (remove.isPending) return;
          remove.reset();
          setDeleting(null);
        }}
        onConfirm={() => {
          if (!deleting) return;
          remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
        }}
      />
    </div>
  );
}
