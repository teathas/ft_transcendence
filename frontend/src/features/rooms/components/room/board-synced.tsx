"use client";

import { useEffect, useState } from "react";
import { useSync, useSyncDemo } from "@tldraw/sync";
import { Tldraw, type Editor } from "tldraw";

import { env } from "@/lib/env";

import { BOARD_COMPONENTS, PROTOTYPE_ASSET_STORE } from "./board-config";
import { useBoardIdentity, type BoardIdentity } from "./use-board-identity";

export type SyncStatus = "loading" | "online" | "offline" | "error";

type BoardProps = {
  roomCode: string;
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
    <Tldraw store={store} onMount={setEditor} components={BOARD_COMPONENTS} />
  );
}

/** tldraw's public demo server: real cursors, but the data is public. */
function DemoBoard({ roomCode, ...rest }: BoardProps) {
  const store = useSyncDemo({ roomId: `shared-room-${roomCode}` });
  return <SyncedTldraw store={store} {...rest} />;
}

/** Our own sync server, once one exists at NEXT_PUBLIC_SYNC_URL. */
function ServerBoard({ roomCode, ...rest }: BoardProps) {
  const store = useSync({
    uri: `${env.syncUrl}/connect/${roomCode}`,
    assets: PROTOTYPE_ASSET_STORE,
  });
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
