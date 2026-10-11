"use client";

import { useState } from "react";
import { Tldraw, type Editor } from "tldraw";

import { useBoardIdentity, type BoardIdentity } from "./use-board-identity";
import { BOARD_COMPONENTS } from "./board-config";

/** Browser-only board: persists per device, no remote cursors. */
export default function BoardLocal({
  roomId,
  identity,
}: {
  roomId: string;
  identity: BoardIdentity;
}) {
  const [editor, setEditor] = useState<Editor | null>(null);
  useBoardIdentity(editor, identity);

  return (
    <Tldraw
      persistenceKey={`shared-room-${roomId}`}
      onMount={setEditor}
      components={BOARD_COMPONENTS}
    />
  );
}
