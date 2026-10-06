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
import { Select, type SelectOption } from "@/components/ui/select";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { useCreateRoom, useUpdateRoom } from "../hooks/use-rooms";
import { SUBJECTS } from "../mocks";
import { createRoomSchema, updateRoomSchema } from "../schemas";
import type { Room } from "../types";

const SUBJECT_OPTIONS: SelectOption[] = SUBJECTS.map((subject) => ({
  value: subject,
  label: subject,
}));

const VISIBILITY_OPTIONS: SelectOption[] = [
  { value: "PUBLIC", label: "Public — anyone with the link can join" },
  { value: "PRIVATE", label: "Private — invite code required" },
];

/**
 * One form for both creating and editing: the fields and validation are
 * identical, only the mutation and the wording differ.
 */
export function RoomFormModal({
  open,
  onClose,
  room,
}: {
  open: boolean;
  onClose: () => void;
  /** Present in edit mode. */
  room?: Room;
}) {
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();

  const isEditing = room !== undefined;
  const mutation = isEditing ? updateRoom : createRoom;
  const isSubmitting = mutation.isPending;
  const apiError = isApiError(mutation.error) ? mutation.error : null;

  const form = useZodForm({
    schema: isEditing ? updateRoomSchema : createRoomSchema,
    initialValues: {
      name: room?.name ?? "",
      subject: room?.subject ?? "",
      visibility: "PUBLIC",
    },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      if (isEditing) {
        updateRoom.mutate(
          { id: room.id, patch: values },
          { onSuccess: onClose },
        );
      } else {
        createRoom.mutate(values);
      }
    },
  });

  const subjectProps = form.getFieldProps("subject");
  const visibilityProps = form.getFieldProps("visibility");

  const pick = (options: SelectOption[], value: string) =>
    options.find((option) => option.value === value) ?? null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit room" : "Create a room"}
      description={
        isEditing
          ? "Changes apply for everyone already in the room."
          : "Give it a name and a subject. You get a code to share right after."
      }
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
              <FieldLabel {...form.getLabelProps("name")}>Room name</FieldLabel>
              <Input
                {...form.getFieldProps("name")}
                placeholder="Mathematics — Algebra"
                autoFocus
              />
              <FieldError {...form.getErrorProps("name")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("subject")}>
                Subject
              </FieldLabel>
              <Select
                inputId={subjectProps.id}
                options={SUBJECT_OPTIONS}
                value={pick(SUBJECT_OPTIONS, subjectProps.value)}
                onChange={(option) =>
                  subjectProps.onChange({
                    target: { value: option?.value ?? "" },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                onBlur={subjectProps.onBlur}
                placeholder="Pick a subject"
                isDisabled={isSubmitting}
              />
              <FieldError {...form.getErrorProps("subject")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("visibility")}>
                Visibility
              </FieldLabel>
              <Select
                inputId={visibilityProps.id}
                options={VISIBILITY_OPTIONS}
                value={
                  pick(VISIBILITY_OPTIONS, visibilityProps.value) ??
                  VISIBILITY_OPTIONS[0]
                }
                onChange={(option) =>
                  visibilityProps.onChange({
                    target: { value: option?.value ?? "PUBLIC" },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                onBlur={visibilityProps.onBlur}
                isDisabled={isSubmitting}
                isSearchable={false}
              />
              <FieldDescription>
                A private room can only be joined with its invite code.
              </FieldDescription>
              <FieldError {...form.getErrorProps("visibility")} />
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
                {isEditing ? "Save changes" : "Create room"}
              </Button>
            </div>
          </FieldGroup>
        </fieldset>
      </form>
    </Modal>
  );
}
