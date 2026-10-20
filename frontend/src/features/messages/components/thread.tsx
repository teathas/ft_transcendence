"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  LoaderCircle,
  SendHorizonal,
  Trash2,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { PresenceDot } from "@/components/ui/presence-dot";
import { Button, buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { routes } from "@/config/routes";
import { isApiError } from "@/lib/api";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import {
  useChatFriend,
  useDeleteMessage,
  useMarkRead,
  useSendMessage,
  useThread,
} from "../hooks/use-messages";
import { DeleteMessageModal } from "./delete-message-modal";

const MAX_LENGTH = 2000;
/** Within this many pixels of the bottom counts as "following along". */
const STICK_TO_BOTTOM = 120;

export function Thread({ friendId }: { friendId: string }) {
  const d = useDict();
  const { time, date } = useFormat();
  const friend = useChatFriend(friendId);
  const thread = useThread(friendId);
  const send = useSendMessage(friendId);
  const markRead = useMarkRead(friendId);
  const remove = useDeleteMessage(friendId);

  const [draft, setDraft] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const last = useRef({ newest: "", oldest: "", height: 0, count: 0 });

  // Pages run newest to oldest; the screen reads oldest to newest.
  const messages = useMemo(
    () => (thread.data?.pages.flatMap((page) => page.items) ?? []).toReversed(),
    [thread.data],
  );

  const hasUnread = messages.some(
    (message) => message.senderId === friendId && !message.readAt,
  );
  const lastMine = messages.findLast(
    (message) => message.senderId !== friendId,
  );

  // Opening a conversation reads it, and so does a message arriving while open.
  const { mutate: readAll, isPending: isReading } = markRead;
  useEffect(() => {
    if (hasUnread && !isReading) readAll();
  }, [hasUnread, isReading, readAll]);

  // Keep the view where the reader is: down for new messages when they were
  // already at the bottom, and still on the same line when older ones are
  // added above.
  useLayoutEffect(() => {
    const box = scroller.current;
    if (!box || messages.length === 0) return;

    const before = last.current;
    const newest = messages[messages.length - 1].id;
    const oldest = messages[0].id;

    if (before.count === 0) {
      box.scrollTop = box.scrollHeight;
    } else if (oldest !== before.oldest) {
      box.scrollTop += box.scrollHeight - before.height;
    } else if (newest !== before.newest) {
      const fromBottom = before.height - box.scrollTop - box.clientHeight;
      const mine = messages[messages.length - 1].senderId !== friendId;
      if (mine || fromBottom < STICK_TO_BOTTOM) {
        box.scrollTop = box.scrollHeight;
      }
    }

    last.current = {
      newest,
      oldest,
      height: box.scrollHeight,
      count: messages.length,
    };
  }, [messages, friendId]);

  function submit(event?: React.FormEvent) {
    event?.preventDefault();
    const content = draft.trim();
    if (!content || send.isPending) return;
    send.mutate(content, { onSuccess: () => setDraft("") });
  }

  const sendError = isApiError(send.error) ? send.error.message : null;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4">
        <Link
          href={routes.messages}
          aria-label={d.messages.back}
          className={buttonStyles({
            variant: "ghost",
            size: "icon",
            className: "md:hidden",
          })}
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>

        {friend.data ? (
          <>
            <Link href={routes.user(friendId)} className="relative shrink-0">
              <Avatar
                src={friend.data.avatarUrl}
                name={friend.data.username}
                className="size-10"
              />
              <PresenceDot online={friend.data.status === "ONLINE"} />
            </Link>
            <div className="min-w-0">
              <h2 className="truncate font-semibold">
                <Link href={routes.user(friendId)} className="hover:underline">
                  {friend.data.username}
                </Link>
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {friend.data.bio ?? d.friends.noBio}
              </p>
            </div>
          </>
        ) : (
          <Skeleton className="h-10 w-48" />
        )}
      </header>

      <div
        ref={scroller}
        className="min-h-0 flex-1 overflow-y-auto bg-muted/30 px-4 py-4"
      >
        {thread.isPending ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((index) => (
              <Skeleton
                key={index}
                className={cn("h-12 w-2/3", index % 2 && "ms-auto")}
              />
            ))}
          </div>
        ) : !thread.data ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {isApiError(thread.error) && thread.error.status === 403
              ? d.messages.error.notFriends
              : d.messages.error.thread}
          </p>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-1">
            {thread.hasNextPage && (
              <Button
                variant="ghost"
                size="sm"
                className="mx-auto mb-3"
                disabled={thread.isFetchingNextPage}
                onClick={() => void thread.fetchNextPage()}
              >
                {thread.isFetchingNextPage && (
                  <LoaderCircle
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {d.messages.loadEarlier}
              </Button>
            )}

            {messages.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t(d.messages.noMessages, {
                  name: friend.data?.username ?? "",
                })}
              </p>
            )}

            {messages.map((message, index) => {
              const mine = message.senderId !== friendId;
              const day = date(message.createdAt);
              const before = messages[index - 1];
              const newDay = !before || date(before.createdAt) !== day;

              return (
                <div key={message.id} className="flex flex-col gap-1">
                  {newDay && (
                    <p className="my-3 text-center text-[11px] font-medium text-muted-foreground">
                      {day}
                    </p>
                  )}
                  <div
                    className={cn(
                      "flex max-w-[80%] flex-col gap-0.5",
                      mine ? "items-end self-end" : "items-start self-start",
                    )}
                  >
                    <p
                      className={cn(
                        "rounded-2xl px-3.5 py-2 text-sm break-words whitespace-pre-wrap",
                        mine
                          ? "rounded-ee-sm bg-primary text-primary-foreground"
                          : "rounded-es-sm border bg-card",
                      )}
                    >
                      {message.content}
                    </p>
                    <p className="flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
                      {time(message.createdAt)}
                      {message === lastMine && message.readAt && (
                        <span className="inline-flex items-center gap-0.5 text-primary">
                          <CheckCheck className="size-3" aria-hidden="true" />
                          {d.messages.seen}
                        </span>
                      )}
                      {mine && (
                        <button
                          type="button"
                          aria-label={d.messages.deleteMessage}
                          title={d.messages.deleteMessage}
                          onClick={() => setDeletingId(message.id)}
                          className="ms-1 inline-flex size-5 items-center justify-center rounded-sm hover:text-destructive"
                        >
                          <Trash2 className="size-3" aria-hidden="true" />
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="shrink-0 border-t p-3">
        {sendError && (
          <p role="alert" className="mb-2 text-sm text-destructive">
            {sendError}
          </p>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends; Shift+Enter makes a new line.
              if (event.key === "Enter" && !event.shiftKey) submit(event);
            }}
            rows={1}
            maxLength={MAX_LENGTH}
            placeholder={d.messages.placeholder}
            aria-label={d.messages.composerLabel}
            className="max-h-32 min-h-10 resize-none"
          />
          <Button
            type="submit"
            size="icon"
            aria-label={d.messages.send}
            disabled={!draft.trim() || send.isPending}
          >
            <SendHorizonal
              className="size-4 rtl:rotate-180"
              aria-hidden="true"
            />
          </Button>
        </div>
      </form>
      <DeleteMessageModal
        open={deletingId !== null}
        pending={remove.isPending}
        error={remove.error}
        onClose={() => {
          if (remove.isPending) return;
          remove.reset();
          setDeletingId(null);
        }}
        onConfirm={() => {
          if (!deletingId) return;
          remove.mutate(deletingId, {
            onSuccess: () => setDeletingId(null),
          });
        }}
      />
    </>
  );
}
