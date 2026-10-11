"use client";

import { MessagesSquare, TriangleAlert, Users } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useConversations } from "../hooks/use-messages";

export function ConversationList({ activeId }: { activeId?: string }) {
  const d = useDict();
  const { relativeTime } = useFormat();
  const { data, isPending } = useConversations();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <h1 className="text-lg font-semibold tracking-tight">
          {d.messages.title}
        </h1>
        <Link
          href={routes.friends}
          className={buttonStyles({ variant: "ghost", size: "sm" })}
        >
          <Users className="size-4" aria-hidden="true" />
          {d.messages.friends}
        </Link>
      </header>

      <nav
        aria-label={d.messages.conversations}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {isPending ? (
          <div className="flex flex-col gap-2 p-3">
            {[0, 1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-16" />
            ))}
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <TriangleAlert
              className="size-5 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {d.messages.error.list}
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <MessagesSquare className="size-5" aria-hidden="true" />
            </span>
            <p className="font-medium">{d.messages.empty.title}</p>
            <p className="text-sm text-pretty text-muted-foreground">
              {d.messages.empty.body}
            </p>
            <Link
              href={routes.friends}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              {d.messages.empty.cta}
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col">
            {data.map(({ friend, lastMessage, unreadCount }) => {
              const active = friend.id === activeId;
              const mine = lastMessage.senderId !== friend.id;

              return (
                <li key={friend.id}>
                  <Link
                    href={routes.thread(friend.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 border-s-2 px-4 py-3 transition-colors",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-accent/60",
                    )}
                  >
                    <Avatar
                      src={friend.avatarUrl}
                      name={friend.username}
                      className="size-11"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm",
                            unreadCount > 0 ? "font-semibold" : "font-medium",
                          )}
                        >
                          {friend.username}
                        </span>
                        <time
                          dateTime={lastMessage.createdAt}
                          className="shrink-0 text-[11px] text-muted-foreground"
                        >
                          {relativeTime(lastMessage.createdAt)}
                        </time>
                      </span>
                      <span className="mt-0.5 flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm",
                            unreadCount > 0
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {mine && `${d.messages.you} `}
                          {lastMessage.content}
                        </span>
                        {unreadCount > 0 && (
                          <span
                            aria-label={t(d.messages.unread, {
                              count: unreadCount,
                            })}
                            className="min-w-5 shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-center text-[11px] leading-none font-medium text-primary-foreground tabular-nums"
                          >
                            {unreadCount}
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </>
  );
}
