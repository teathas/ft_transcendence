"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { isApiError } from "@/lib/api";

import { useRemoveFriend } from "../hooks/use-friends";
import type { Friend } from "../types";

/** Removing a friend ends the conversation too, so it asks first. */
export function RemoveFriendModal({
  friend,
  open,
  onClose,
}: {
  friend: Friend;
  open: boolean;
  onClose: () => void;
}) {
  const d = useDict();
  const remove = useRemoveFriend();
  const error = isApiError(remove.error) ? remove.error : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(d.friends.remove.title, { name: friend.user.username })}
      description={d.friends.remove.description}
    >
      <div className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={remove.isPending}>
            {d.common.cancel}
          </Button>
          <Button
            variant="destructive"
            disabled={remove.isPending}
            onClick={() =>
              remove.mutate(friend.friendshipId, { onSuccess: onClose })
            }
          >
            {remove.isPending && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {d.friends.remove.confirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
