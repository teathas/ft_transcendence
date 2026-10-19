"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  LoaderCircle,
  MessageSquare,
  SendHorizonal,
  Trash2,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/use-auth";
import { DeleteMessageModal } from "@/features/messages/components/delete-message-modal";
import { useDict } from "@/i18n/client";
import { useFormat } from "@/lib/format";
import { linkify } from "@/lib/linkify";
import { cn } from "@/lib/utils";

import {
  flattenMessages,
  useDeleteMessage,
  useMessages,
  useParticipants,
  useRoom,
  useSendMessage,
} from "../../hooks/use-room";
import type { Message } from "../../types";

const MAX_LENGTH = 2000;
/** Messages by the same person closer together than this share one heading. */
const GROUP_GAP_MS = 5 * 60_000;
/** Within this many pixels of the bottom counts as "reading the latest". */
const NEAR_BOTTOM = 80;

type Row =
  | { kind: "day"; key: string; label: string }
  | { kind: "message"; key: string; message: Message; heading: boolean };

export function ChatPanel({ roomId }: { roomId: string }) {
  const d = useDict();
  const { time, dayLabel } = useFormat();
  const { user } = useSession();
  const { data: room } = useRoom(roomId);
  const { data: people } = useParticipants(roomId);
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMessages(roomId);
  const messages = useMemo(() => flattenMessages(data), [data]);
  const send = useSendMessage(roomId);
  const remove = useDeleteMessage(roomId);

  const [draft, setDraft] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  // The newest message when the reader scrolled away, to tell "new" from "latest".
  const [leftAt, setLeftAt] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const last = useRef({ newest: "", oldest: "", height: 0 });

  const avatars = useMemo(
    () => new Map(people?.map((person) => [person.id, person.avatarUrl])),
    [people],
  );

  // The conversation as rows: a day label whenever the day changes, and a
  // heading (avatar, name, time) only where a different person starts talking
  // or a pause has passed.
  const rows = useMemo(() => {
    const result: Row[] = [];
    messages.forEach((message, index) => {
      const before = messages[index - 1];
      const day = dayLabel(message.sentAt);
      const newDay = !before || dayLabel(before.sentAt) !== day;
      if (newDay)
        result.push({ kind: "day", key: `day-${message.id}`, label: day });

      const heading =
        newDay ||
        before.authorId !== message.authorId ||
        new Date(message.sentAt).getTime() - new Date(before.sentAt).getTime() >
          GROUP_GAP_MS;
      result.push({ kind: "message", key: message.id, message, heading });
    });
    return result;
  }, [messages, dayLabel]);

  // Stay on the same line when older messages arrive above, follow the
  // conversation down when the reader is already at the bottom (or wrote it).
  useLayoutEffect(() => {
    const box = scroller.current;
    if (!box || messages.length === 0) return;

    const before = last.current;
    const newest = messages[messages.length - 1];
    const oldest = messages[0].id;

    if (before.newest === "") {
      box.scrollTop = box.scrollHeight;
    } else if (oldest !== before.oldest) {
      box.scrollTop += box.scrollHeight - before.height;
    } else if (newest.id !== before.newest) {
      const mine =
        newest.authorId === user?.id || newest.authorId === "pending";
      const near =
        before.height - box.scrollTop - box.clientHeight < NEAR_BOTTOM;
      if (mine || near) box.scrollTop = box.scrollHeight;
    }

    last.current = { newest: newest.id, oldest, height: box.scrollHeight };
  }, [messages, user?.id]);

  // The box grows with what is typed, up to a few lines.
  useLayoutEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft]);

  function onScroll() {
    const box = scroller.current;
    if (!box) return;
    const near =
      box.scrollHeight - box.scrollTop - box.clientHeight < NEAR_BOTTOM;
    setAtBottom(near);
    // Remember what was newest when the reader left the bottom.
    setLeftAt((before) =>
      near ? null : (before ?? messages.at(-1)?.id ?? null),
    );
  }

  function jumpToLatest() {
    const box = scroller.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }

  function submit(event?: React.FormEvent) {
    event?.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    send.mutate(body);
  }

  const newest = messages.at(-1)?.id ?? null;
  const hasNew = !atBottom && leftAt !== null && leftAt !== newest;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div
          ref={scroller}
          onScroll={onScroll}
          role="log"
          aria-label={d.room.messagesLabel}
          className="h-full overflow-y-auto overscroll-contain py-3"
        >
          {isPending ? (
            <div className="flex flex-col gap-4 px-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <MessageSquare className="size-5" aria-hidden="true" />
              </span>
              <p className="font-medium">{d.room.chatEmpty.title}</p>
              <p className="text-sm text-pretty text-muted-foreground">
                {d.room.chatEmpty.body}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {hasNextPage && (
                <li className="flex justify-center pb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isFetchingNextPage}
                    onClick={() => void fetchNextPage()}
                    className="rounded-full"
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

              {rows.map((row) =>
                row.kind === "day" ? (
                  <li
                    key={row.key}
                    className="my-3 flex items-center gap-3 px-4"
                  >
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-medium text-muted-foreground first-letter:uppercase">
                      {row.label}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </li>
                ) : (
                  <MessageRow
                    key={row.key}
                    message={row.message}
                    heading={row.heading}
                    mine={row.message.authorId === user?.id}
                    avatarUrl={avatars.get(row.message.authorId) ?? null}
                    time={time(row.message.sentAt)}
                    youLabel={d.room.you}
                    canDelete={
                      row.message.authorId === user?.id ||
                      room?.ownerId === user?.id
                    }
                    deleteLabel={d.messages.deleteMessage}
                    onDelete={() => setDeletingId(row.message.id)}
                  />
                ),
              )}
            </ul>
          )}
        </div>

        {!atBottom && messages.length > 0 && (
          <Button
            size="sm"
            onClick={jumpToLatest}
            className={cn(
              "absolute start-1/2 bottom-3 -translate-x-1/2 rounded-full shadow-lg rtl:translate-x-1/2",
              !hasNew && "border bg-card text-foreground hover:bg-accent",
            )}
          >
            <ArrowDown className="size-3.5" aria-hidden="true" />
            {hasNew ? d.room.newMessages : d.room.jumpToLatest}
          </Button>
        )}
      </div>

      <form onSubmit={submit} className="shrink-0 border-t p-3">
        <div className="flex items-end gap-2 rounded-2xl border bg-background p-1.5 transition-shadow focus-within:ring-[3px] focus-within:ring-ring/30">
          <textarea
            ref={field}
            value={draft}
            rows={1}
            maxLength={MAX_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends; Shift+Enter makes a new line.
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={d.room.chatPlaceholder}
            aria-label={d.room.message}
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="icon"
            aria-label={d.room.send}
            disabled={!draft.trim()}
            className="rounded-full"
          >
            <SendHorizonal
              className="size-4 rtl:rotate-180"
              aria-hidden="true"
            />
          </Button>
        </div>
        <p className="mt-1.5 hidden px-2 text-[11px] text-muted-foreground lg:block">
          {d.room.sendHint}
        </p>
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
    </div>
  );
}

function MessageRow({
  message,
  heading,
  mine,
  avatarUrl,
  time,
  youLabel,
  canDelete,
  deleteLabel,
  onDelete,
}: {
  message: Message;
  heading: boolean;
  mine: boolean;
  avatarUrl: string | null;
  time: string;
  youLabel: string;
  canDelete: boolean;
  deleteLabel: string;
  onDelete: () => void;
}) {
  const pending = message.id.startsWith("pending-");

  return (
    <li
      className={cn(
        "group flex gap-3 px-4 py-0.5 transition-colors hover:bg-muted/50",
        heading && "mt-2 pt-1",
        pending && "opacity-60",
      )}
    >
      <span className="w-8 shrink-0 pt-0.5">
        {heading ? (
          <Avatar
            src={avatarUrl}
            name={message.authorUsername}
            className="size-8"
          />
        ) : (
          <span className="hidden pt-1 text-[10px] text-muted-foreground tabular-nums group-hover:block">
            {time}
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        {heading && (
          <p className="flex items-baseline gap-2">
            <span
              className={cn(
                "truncate text-sm font-semibold",
                mine && "text-primary",
              )}
            >
              {mine ? youLabel : message.authorUsername}
            </span>
            <time
              dateTime={message.sentAt}
              className="shrink-0 text-[11px] text-muted-foreground"
            >
              {time}
            </time>
          </p>
        )}
        <p
          dir="auto"
          className="text-sm leading-relaxed [overflow-wrap:anywhere] whitespace-pre-wrap"
        >
          {linkify(message.body)}
        </p>
      </div>
      {canDelete && !pending && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={deleteLabel}
          title={deleteLabel}
          onClick={onDelete}
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </Button>
      )}
    </li>
  );
}
