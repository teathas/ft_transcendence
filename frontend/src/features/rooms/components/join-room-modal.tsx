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
import { useDict } from "@/i18n/client";
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
  const d = useDict();
  const joinRoom = useJoinRoom();
  const isSubmitting = joinRoom.isPending;
  const apiError = isApiError(joinRoom.error) ? joinRoom.error : null;

  const form = useZodForm({
    schema: joinRoomSchema,
    initialValues: { code: "" },
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
      title={d.rooms.join.title}
      description={d.rooms.join.description}
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
              <FieldLabel {...form.getLabelProps("code")}>
                {d.rooms.join.code}
              </FieldLabel>
              <Input
                {...form.getFieldProps("code")}
                placeholder={d.rooms.join.codePlaceholder}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="font-mono tracking-wider uppercase"
                autoFocus
              />
              <FieldDescription>{d.rooms.join.codeHint}</FieldDescription>
              <FieldError {...form.getErrorProps("code")} />
            </Field>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={onClose}>
                {d.common.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {d.rooms.join.submit}
              </Button>
            </div>
          </FieldGroup>
        </fieldset>
      </form>
    </Modal>
  );
}
