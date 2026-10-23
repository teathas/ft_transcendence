import { useEffect, useState } from "react";

import { api } from "@/lib/api";

/**
 * A room file's bytes. The request carries the access token in the
 * Authorization header (renewed by the API client when it has expired), so
 * the token never appears in a URL.
 */
export async function fetchRoomFile(url: string) {
  const { data } = await api.get<Blob>(url, { responseType: "blob" });
  return data;
}

/** A `blob:` address to put in an <img> or <iframe>; null until it is loaded. */
export function useBlobUrl(url: string | undefined) {
  const [loaded, setLoaded] = useState<{ source: string; blobUrl: string }>();

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    let blobUrl: string | null = null;

    fetchRoomFile(url)
      .then((blob) => {
        if (cancelled) return;
        blobUrl = URL.createObjectURL(blob);
        setLoaded({ source: url, blobUrl });
      })
      .catch(() => {
        // Stays null: the caller shows its placeholder.
      });

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [url]);

  return loaded && loaded.source === url ? loaded.blobUrl : null;
}
