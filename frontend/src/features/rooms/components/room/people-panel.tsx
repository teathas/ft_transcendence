"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PresenceDot } from "@/components/ui/presence-dot";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/use-auth";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { routes } from "@/config/routes";

import { useParticipants, useRoom } from "../../hooks/use-room";
import type { Participant } from "../../types";

function Person({ person, isMe }: { person: Participant; isMe: boolean }) {
  const d = useDict();

  return (
    <li className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/50">
      {/* The name is the link for keyboards and screen readers; the avatar is
          the same link for the mouse only, so it is not read or tabbed twice. */}
      <Link
        href={routes.user(person.id)}
        tabIndex={-1}
        aria-hidden="true"
        className="relative shrink-0"
      >
        <Avatar
          src={person.avatarUrl}
          name={person.username}
          className="size-9"
        />
        <PresenceDot online={person.online} />
      </Link>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <Link
            href={routes.user(person.id)}
            className="truncate rounded-sm text-sm font-medium hover:underline"
          >
            {person.username}
          </Link>
          {isMe && (
            <span className="shrink-0 text-xs text-muted-foreground">
              ({d.room.you})
            </span>
          )}
        </span>
        <span className="block text-xs text-muted-foreground">
          {person.online ? d.room.online : d.room.offline}
        </span>
      </span>

      {person.role === "host" && (
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          {d.room.host}
        </span>
      )}
    </li>
  );
}

function Group({
  label,
  people,
  myId,
}: {
  label: string;
  people: Participant[];
  myId?: string;
}) {
  if (people.length === 0) return null;

  return (
    <section aria-label={label}>
      <h3 className="px-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </h3>
      <ul className="flex flex-col">
        {people.map((person) => (
          <Person key={person.id} person={person} isMe={person.id === myId} />
        ))}
      </ul>
    </section>
  );
}

export function PeoplePanel({ roomId }: { roomId: string }) {
  const d = useDict();
  const { user } = useSession();
  const { data: room } = useRoom(roomId);
  const { data: participants, isPending } = useParticipants(roomId);
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!room?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(room.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code stays readable above.
    }
  }

  const online = participants?.filter((person) => person.online) ?? [];
  const offline = participants?.filter((person) => !person.online) ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
      {room?.inviteCode && (
        <section className="flex flex-col gap-3 rounded-xl border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold">{d.room.inviteTitle}</h3>
            <p className="mt-0.5 text-xs text-pretty text-muted-foreground">
              {d.room.inviteBody}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex h-11 min-w-0 flex-1 items-center justify-center rounded-lg border bg-background px-3 font-mono text-sm tracking-widest uppercase">
              {room.inviteCode}
            </code>
            <Button variant="outline" onClick={copy} className="h-11 shrink-0">
              {copied && <Check className="size-4" aria-hidden="true" />}
              {copied ? d.room.copied : d.room.copyInviteCode}
            </Button>
          </div>
          {/* Says "Code copied" to screen readers, which do not see the label change. */}
          <span role="status" className="sr-only">
            {copied ? d.room.copied : ""}
          </span>
        </section>
      )}

      {isPending ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </div>
      ) : (
        <>
          <Group
            label={t(d.room.peopleOnline, { count: online.length })}
            people={online}
            myId={user?.id}
          />
          <Group
            label={t(d.room.peopleOffline, { count: offline.length })}
            people={offline}
            myId={user?.id}
          />
        </>
      )}
    </div>
  );
}
