"use client";

import { useState } from "react";
import { Check, Clock, MessageCircle, UserMinus, UserPlus, X } from "lucide-react";

import { Button, buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { Link } from "@/i18n/navigation";

import {
  useAcceptRequest,
  useCancelRequest,
  useRejectRequest,
  useSendRequest,
} from "../hooks/use-friends";
import type { Friend, FriendRequest, Person } from "../types";
import { RemoveFriendModal } from "./remove-friend-modal";

// Each row owns its mutations, so "pending" belongs to that row's button alone.

function MessageLink({ userId, name }: { userId: string; name: string }) {
  const d = useDict();

  return (
    <Link
      href={routes.thread(userId)}
      aria-label={t(d.friends.actions.messageNamed, { name })}
      className={buttonStyles({ size: "sm" })}
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      {d.friends.actions.message}
    </Link>
  );
}

export function FriendActions({ friend }: { friend: Friend }) {
  const d = useDict();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <MessageLink userId={friend.user.id} name={friend.user.username} />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirming(true)}
        aria-label={t(d.friends.actions.removeNamed, {
          name: friend.user.username,
        })}
      >
        <UserMinus className="size-4" aria-hidden="true" />
        {d.friends.actions.remove}
      </Button>

      <RemoveFriendModal
        friend={friend}
        open={confirming}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}

export function ReceivedActions({ request }: { request: FriendRequest }) {
  const d = useDict();
  const accept = useAcceptRequest();
  const reject = useRejectRequest();
  const busy = accept.isPending || reject.isPending;

  return (
    <>
      <Button
        size="sm"
        disabled={busy}
        onClick={() =>
          accept.mutate({
            requestId: request.requestId,
            name: request.user.username,
          })
        }
      >
        <Check className="size-4" aria-hidden="true" />
        {d.friends.actions.accept}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => reject.mutate(request.requestId)}
      >
        <X className="size-4" aria-hidden="true" />
        {d.friends.actions.decline}
      </Button>
    </>
  );
}

export function SentActions({ request }: { request: FriendRequest }) {
  const d = useDict();
  const cancel = useCancelRequest();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={cancel.isPending}
      onClick={() => cancel.mutate(request.requestId)}
    >
      <X className="size-4" aria-hidden="true" />
      {d.friends.actions.cancel}
    </Button>
  );
}

/** What a search hit offers depends on how it stands with you. */
export function PersonActions({
  person,
  onViewRequest,
}: {
  person: Person;
  /** Opens the received-requests tab on this person. */
  onViewRequest: (username: string) => void;
}) {
  const d = useDict();
  const send = useSendRequest();

  switch (person.relationship) {
    case "friends":
      return <MessageLink userId={person.id} name={person.username} />;

    case "sent":
      return (
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-muted px-3 text-sm text-muted-foreground">
          <Clock className="size-3.5" aria-hidden="true" />
          {d.friends.relationship.sent}
        </span>
      );

    case "received":
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewRequest(person.username)}
        >
          {d.friends.actions.viewRequest}
        </Button>
      );

    default:
      return (
        <Button
          size="sm"
          disabled={send.isPending}
          onClick={() => send.mutate({ userId: person.id, name: person.username })}
        >
          <UserPlus className="size-4" aria-hidden="true" />
          {d.friends.actions.add}
        </Button>
      );
  }
}
