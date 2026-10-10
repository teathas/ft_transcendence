"use client";

import { useEffect, useRef, useState } from "react";
import { getSnapshot, Tldraw, type Editor, type TLStoreSnapshot } from "tldraw";

import { useToast } from "@/components/ui/toast";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";

import { useRoomBoard, useSaveBoard } from "../../hooks/use-room";
import { BOARD_COMPONENTS } from "./board-config";
import { useBoardIdentity, type BoardIdentity } from "./use-board-identity";

/** Edits are saved this long after the last one. */
const SAVE_DELAY = 2_000;

/**
 * The board as one document stored with the room: loaded when the room opens,
 * saved whole shortly after you stop drawing. Other people do not see it live —
 * they get it when they open the room.
 *
 * Provisional. A save carries the version it started from, and the API refuses
 * it if someone saved in between; this component then stops saving and says so
 * instead of overwriting their work.
 */
export default function BoardLocal({
  roomId,
  identity,
}: {
  roomId: string;
  identity: BoardIdentity;
}) {
  const d = useDict();
  const toast = useToast();
  const { data: board } = useRoomBoard(roomId);
  const { mutateAsync: saveBoard } = useSaveBoard(roomId);

  // Only the first value counts: later ones are our own saves coming back.
  const [initial] = useState(
    () => (board?.snapshot ?? undefined) as TLStoreSnapshot | undefined,
  );
  const version = useRef(board?.version ?? 0);

  const [editor, setEditor] = useState<Editor | null>(null);
  useBoardIdentity(editor, identity);

  useEffect(() => {
    if (!editor) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let saving = false;
    let dirty = false;
    let blocked = false;

    async function flush() {
      if (!editor || saving || blocked || !dirty) return;
      saving = true;
      dirty = false;

      try {
        const saved = await saveBoard({
          snapshot: { ...getSnapshot(editor.store).document },
          baseVersion: version.current,
        });
        version.current = saved.version;
      } catch (error) {
        if (isApiError(error) && error.status === 409) {
          blocked = true;
          toast(d.room.board.conflict);
        } else {
          // Offline or a server hiccup: try again with the next edit.
          dirty = true;
        }
      } finally {
        saving = false;
      }
    }

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(() => void flush(), SAVE_DELAY);
    }

    const stop = editor.store.listen(
      () => {
        dirty = true;
        schedule();
      },
      // Only what the person did to the document, not selection or camera.
      { source: "user", scope: "document" },
    );

    return () => {
      stop();
      clearTimeout(timer);
      void flush();
    };
  }, [editor, saveBoard, toast, d]);

  return (
    <Tldraw
      snapshot={initial}
      onMount={setEditor}
      components={BOARD_COMPONENTS}
    />
  );
}
