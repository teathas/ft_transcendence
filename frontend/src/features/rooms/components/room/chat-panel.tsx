"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useMessages, useSendMessage } from "../../hooks/use-room";

function timeOf(iso: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function ChatPanel({ roomCode }: { roomCode: string }) {
  const { data: messages, isPending } = useMessages(roomCode);
  const sendMessage = useSendMessage(roomCode);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Follow the conversation as it grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
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
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isPending ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-14" />
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {messages?.map((message) => {
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
                        {timeOf(message.sentAt)}
                      </span>
                    </p>
                    <p className="mt-1 rounded-lg rounded-tl-sm bg-muted/60 px-3 py-2 text-sm text-pretty">
                      {message.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a question…"
          aria-label="Message"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send"
          disabled={!draft.trim()}
        >
          <SendHorizonal className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
