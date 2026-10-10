export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * The types `POST /users/me/avatar` accepts — its `FileTypeValidator` matches
 * jpg, jpeg, png and webp. Anything else would only come back as an error.
 */
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const AVATAR_MAX_EDGE = 512;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Returns an error message, or `null` when the file is usable. */
export function validateImageFile(file: File): string | null {
  if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) {
    return "Only JPG, PNG or WebP images are accepted.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `Images must be under ${formatBytes(MAX_IMAGE_BYTES)}.`;
  }
  return null;
}

/**
 * Shrink an image before upload so a phone photo does not travel at full size.
 *
 * Returns the original file untouched if the browser cannot decode or re-encode
 * it — a bigger upload is better than a broken one.
 */
export async function downscaleImage(
  file: File,
  maxEdge = AVATAR_MAX_EDGE,
): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.9),
    );

    return blob ?? file;
  } catch {
    return file;
  }
}
