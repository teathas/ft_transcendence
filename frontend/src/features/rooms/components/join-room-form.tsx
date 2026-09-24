"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { useJoinRoom } from "../hooks/use-rooms";
import { joinRoomSchema } from "../schemas";

export function JoinRoomForm({
  labelHidden = false,
  submitLabel = "Join room",
}: {
  labelHidden?: boolean;
  submitLabel?: string;
}) {
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
    <form onSubmit={form.handleSubmit} noValidate>
      <fieldset disabled={isSubmitting}>
        <FieldGroup className="gap-4">
          {apiError && !apiError.fieldErrors && (
            <Alert variant="destructive">
              <AlertDescription>{apiError.message}</AlertDescription>
            </Alert>
          )}

          <Field>
            <FieldLabel
              {...form.getLabelProps("code")}
              className={labelHidden ? "sr-only" : undefined}
            >
              Room code
            </FieldLabel>
            <Input
              {...form.getFieldProps("code")}
              placeholder="ALG-4271"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="font-mono tracking-wider uppercase"
            />
            <FieldError {...form.getErrorProps("code")} />
          </Field>

          <Button type="submit" variant="outline" disabled={isSubmitting}>
            {isSubmitting && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {submitLabel}
          </Button>
        </FieldGroup>
      </fieldset>
    </form>
  );
}
