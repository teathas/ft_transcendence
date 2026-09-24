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

import { useCreateRoom } from "../hooks/use-rooms";
import { createRoomSchema } from "../schemas";

export function CreateRoomForm({
  labelHidden = false,
  submitLabel = "Create room",
}: {
  labelHidden?: boolean;
  submitLabel?: string;
}) {
  const createRoom = useCreateRoom();
  const isSubmitting = createRoom.isPending;
  const apiError = isApiError(createRoom.error) ? createRoom.error : null;

  const form = useZodForm({
    schema: createRoomSchema,
    initialValues: { name: "" },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      createRoom.mutate(values);
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
              {...form.getLabelProps("name")}
              className={labelHidden ? "sr-only" : undefined}
            >
              Room name
            </FieldLabel>
            <Input
              {...form.getFieldProps("name")}
              placeholder="Mathematics — Algebra"
            />
            <FieldError {...form.getErrorProps("name")} />
          </Field>

          <Button type="submit" disabled={isSubmitting}>
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
