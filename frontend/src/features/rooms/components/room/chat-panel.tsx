"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDict } from "@/i18n/client";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import {
  flattenMessages,
  useMessages,
  useSendMessage,
} from "../../hooks/use-room";

export function ChatPanel({ roomId }: { roomId: string }) {
  const d = useDict();
  const { time } = useFormat();
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessages(roomId);
  const messages = useMemo(() => flattenMessages(data), [data]);
  const sendMessage = useSendMessage(roomId);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const last = useRef({ newest: "", oldest: "", height: 0 });

  // Follow the conversation down when something new arrives, and stay on the
  // same line when older messages are added above.
  useLayoutEffect(() => {
    const box = scroller.current;
    if (!box || messages.length === 0) return;

    const before = last.current;
    const newest = messages[messages.length - 1].id;
    const oldest = messages[0].id;

    if (before.newest === "") {
      box.scrollTop = box.scrollHeight;
    } else if (oldest !== before.oldest) {
      box.scrollTop += box.scrollHeight - before.height;
    } else if (newest !== before.newest) {
      box.scrollTop = box.scrollHeight;
    }

    last.current = { newest, oldest, height: box.scrollHeight };
  }, [messages]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    sendMessage.mutate(body);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto p-4">
        {isPending ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-14" />
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {hasNextPage && (
              <li className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isFetchingNextPage}
                  onClick={() => void fetchNextPage()}
                >
                  {isFetchingNextPage && (
                    <LoaderCircle
                      className="size-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  {d.messages.loadEarlier}
                </Button>
              </li>
            )}
            {messages.map((message) => {
              const isPendingMessage = message.id.startsWith("pending-");

              return (
                <li
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2.5",
                    isPendingMessage && "opacity-60",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: message.authorColor }}
                  >
                    {message.authorUsername.slice(0, 2).toUpperCase()}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-2">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: message.authorColor }}
                      >
                        {message.authorUsername}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {time(message.sentAt)}
                      </span>
                    </p>
                    <p className="mt-1 rounded-lg rounded-ss-sm bg-muted/60 px-3 py-2 text-sm text-pretty">
                      {message.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={d.room.chatPlaceholder}
          aria-label={d.room.message}
        />
        <Button
          type="submit"
          size="icon"
          aria-label={d.room.send}
          disabled={!draft.trim()}
        >
          <SendHorizonal className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
