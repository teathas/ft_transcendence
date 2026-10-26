"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSync, useSyncDemo } from "@tldraw/sync";
import { Tldraw, type Editor, type TLAssetStore } from "tldraw";

import { useUploadRoomFile } from "@/features/rooms/hooks/use-room";
import { getValidToken, tokenStore } from "@/lib/api";
import { env } from "@/lib/env";

import { BOARD_COMPONENTS } from "./board-config";
import { useBoardIdentity, type BoardIdentity } from "./use-board-identity";

export type SyncStatus = "loading" | "online" | "offline" | "error";

type BoardProps = {
  roomId: string;
  identity: BoardIdentity;
  onStatusChange: (status: SyncStatus) => void;
};

function toStatus(raw: string): SyncStatus {
  if (raw === "synced-remote") return "online";
  if (raw === "loading") return "loading";
  if (raw === "error") return "error";
  return "offline";
}

function SyncedTldraw({
  store,
  identity,
  onStatusChange,
}: {
  store: React.ComponentProps<typeof Tldraw>["store"];
  identity: BoardIdentity;
  onStatusChange: (status: SyncStatus) => void;
}) {
  const [editor, setEditor] = useState<Editor | null>(null);
  useBoardIdentity(editor, identity);

  const raw =
    store && typeof store === "object" && "status" in store
      ? String(store.status)
      : "loading";

  // Reported from an effect: telling the parent during render would be a side
  // effect in the render phase.
  useEffect(() => {
    onStatusChange(toStatus(raw));
  }, [raw, onStatusChange]);

  return (
    <Tldraw
      store={store}
      onMount={setEditor}
      components={BOARD_COMPONENTS}
      licenseKey={env.tldrawLicenseKey}
    />
  );
}

/** tldraw's public demo server: real cursors, but the data is public. */
function DemoBoard({ roomId, ...rest }: BoardProps) {
  const store = useSyncDemo({ roomId: `shared-room-${roomId}` });
  return <SyncedTldraw store={store} {...rest} />;
}

/**
 * Images dropped on the board are uploaded as room files, so the board document
 * holds a link rather than the picture itself.
 */
function useRoomAssetStore(roomId: string): TLAssetStore {
  const { mutateAsync: upload } = useUploadRoomFile(roomId);

  return useMemo(
    () => ({
      async upload(_asset, file) {
        const uploaded = await upload({ file });
        // Persist no credential in the shared board document. Every viewer
        // supplies their own current token from `resolve` below.
        return { src: `${env.apiUrl}${uploaded.url}` };
      },
      resolve: (asset) => {
        if (!asset.props.src) return null;
        const url = new URL(asset.props.src, window.location.origin);
        url.searchParams.set("token", tokenStore.get() ?? "");
        url.searchParams.set("preview", "1");
        return url.toString();
      },
    }),
    [upload],
  );
}

/** The API's own sync server: who may connect is decided by the token. */
function ServerBoard({ roomId, ...rest }: BoardProps) {
  const assets = useRoomAssetStore(roomId);
  // A function, so a reconnect sends the current token — renewed first if it
  // has expired. A browser cannot set headers on a websocket, hence the query
  // string. It must keep the same identity between renders: a new one makes
  // `useSync` reconnect.
  const uri = useCallback(async () => {
    const token = await getValidToken();
    return `${env.syncUrl}/sync/${roomId}?token=${encodeURIComponent(token ?? "")}`;
  }, [roomId]);
  const store = useSync({ uri, assets });
  return <SyncedTldraw store={store} {...rest} />;
}

/**
 * Two hooks, two components: `useSync` and `useSyncDemo` cannot be chosen
 * between inside one component without calling a hook conditionally.
 */
export default function BoardSynced(props: BoardProps) {
  return env.syncMode === "demo" ? (
    <DemoBoard {...props} />
  ) : (
    <ServerBoard {...props} />
  );
}
