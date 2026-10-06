"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { useJoinRoom } from "../hooks/use-rooms";
import { joinRoomSchema } from "../schemas";

export function JoinRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const joinRoom = useJoinRoom();
  const isSubmitting = joinRoom.isPending;
  const apiError = isApiError(joinRoom.error) ? joinRoom.error : null;

  const form = useZodForm({
    schema: joinRoomSchema,
    initialValues: { roomId: "", inviteCode: "" },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      joinRoom.mutate(values);
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Join a room"
      description="Paste the room ID the host shared with you."
    >
      <form onSubmit={form.handleSubmit} noValidate>
        <fieldset disabled={isSubmitting}>
          <FieldGroup className="gap-4">
            {apiError && !apiError.fieldErrors && (
              <Alert variant="destructive">
                <AlertDescription>{apiError.message}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel {...form.getLabelProps("roomId")}>Room ID</FieldLabel>
              <Input
                {...form.getFieldProps("roomId")}
                placeholder="3f1c9a20-0001-4d7a-9f10-7c2b5e8a1d40"
                autoComplete="off"
                spellCheck={false}
                className="font-mono text-xs"
                autoFocus
              />
              <FieldDescription>
                The API joins by room ID, not by code — ask the host for it.
              </FieldDescription>
              <FieldError {...form.getErrorProps("roomId")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("inviteCode")}>
                Invite code
              </FieldLabel>
              <Input
                {...form.getFieldProps("inviteCode")}
                placeholder="a1b2c3d4"
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
              />
              <FieldDescription>
                Only needed for a private room.
              </FieldDescription>
              <FieldError {...form.getErrorProps("inviteCode")} />
            </Field>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Join room
              </Button>
            </div>
          </FieldGroup>
        </fieldset>
      </form>
    </Modal>
  );
}
