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
import { useDict } from "@/i18n/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { useCreateRoom, useUpdateRoom } from "../hooks/use-rooms";
import { SUBJECTS } from "../mocks";
import { createRoomSchema } from "../schemas";
import { useSubjectLabel } from "../subject-label";
import type { Room } from "../types";

/**
 * The room form. Without `room` it creates one; with `room` it edits it, and
 * the caller mounts it only while editing so the fields start from that room.
 */
export function CreateRoomModal({
  open,
  onClose,
  room,
}: {
  open: boolean;
  onClose: () => void;
  room?: Room;
}) {
  const d = useDict();
  const subjectLabel = useSubjectLabel();
  const subjectOptions: SelectOption[] = SUBJECTS.map((subject) => ({
    value: subject,
    label: subjectLabel(subject),
  }));
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom(room?.id ?? "");
  const mutation = room ? updateRoom : createRoom;
  const isSubmitting = mutation.isPending;
  const apiError = isApiError(mutation.error) ? mutation.error : null;
  const texts = room ? d.rooms.edit : d.rooms.create;

  const form = useZodForm({
    schema: createRoomSchema,
    initialValues: {
      name: room?.name ?? "",
      subject: room?.subject ?? "",
      visibility: room?.visibility ?? "PUBLIC",
    },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      if (room) updateRoom.mutate(values, { onSuccess: onClose });
      else createRoom.mutate(values);
    },
  });

  const subjectProps = form.getFieldProps("subject");

  const visibilityProps = form.getFieldProps("visibility");
  const visibilityOptions: SelectOption[] = [
    { value: "PUBLIC", label: d.rooms.create.public },
    { value: "PRIVATE", label: d.rooms.create.private },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={texts.title}
      description={texts.description}
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
              <FieldLabel {...form.getLabelProps("name")}>
                {d.rooms.create.name}
              </FieldLabel>
              <Input
                {...form.getFieldProps("name")}
                placeholder={d.rooms.create.namePlaceholder}
                autoFocus
              />
              <FieldError {...form.getErrorProps("name")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("subject")}>
                {d.rooms.create.subject}
              </FieldLabel>
              <Select
                inputId={subjectProps.id}
                options={subjectOptions}
                value={
                  subjectOptions.find(
                    (option) => option.value === subjectProps.value,
                  ) ?? null
                }
                onChange={(option) =>
                  subjectProps.onChange({
                    target: { value: option?.value ?? "" },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                onBlur={subjectProps.onBlur}
                placeholder={d.rooms.create.subjectPlaceholder}
                isDisabled={isSubmitting}
              />
              <FieldError {...form.getErrorProps("subject")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("visibility")}>
                {d.rooms.create.visibility}
              </FieldLabel>
              <Select
                inputId={visibilityProps.id}
                options={visibilityOptions}
                value={visibilityOptions.find(
                  (option) => option.value === visibilityProps.value,
                )}
                onChange={(option) =>
                  visibilityProps.onChange({
                    target: { value: option?.value ?? "PUBLIC" },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                isSearchable={false}
                isDisabled={isSubmitting}
              />
              <FieldDescription>
                {visibilityProps.value === "PRIVATE"
                  ? d.rooms.create.privateHint
                  : d.rooms.create.publicHint}
              </FieldDescription>
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
                {texts.submit}
              </Button>
            </div>
          </FieldGroup>
        </fieldset>
      </form>
    </Modal>
  );
}
