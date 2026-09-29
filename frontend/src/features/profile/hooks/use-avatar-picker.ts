"use client";

import { useEffect, useState } from "react";

import { validateImageFile } from "@/lib/image";

/**
 * Local state for choosing an avatar file: validation, preview lifecycle and
 * clearing. The caller decides when to upload — this only prepares the file.
 */
export function useAvatarPicker(currentAvatarUrl: string | null) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Each preview holds a blob in memory until it is revoked. The cleanup runs
  // on the previous URL whenever a new one replaces it.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function select(next: File | undefined) {
    if (!next) return;

    const problem = validateImageFile(next);
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  }

  function clear() {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  return {
    file,
    error,
    /** What the avatar should show right now: the pick, else what is saved. */
    shownAvatar: previewUrl ?? currentAvatarUrl,
    hasPick: file !== null,
    select,
    clear,
  };
}

export type AvatarPicker = ReturnType<typeof useAvatarPicker>;
