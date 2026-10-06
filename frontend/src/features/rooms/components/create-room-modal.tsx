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

import { useCreateRoom } from "../hooks/use-rooms";
import { SUBJECTS } from "../mocks";
import { createRoomSchema } from "../schemas";

const SUBJECT_OPTIONS: SelectOption[] = SUBJECTS.map((subject) => ({
  value: subject,
  label: subject,
}));

const VISIBILITY_OPTIONS: SelectOption[] = [
  { value: "PUBLIC", label: "Public — anyone with the link can join" },
  { value: "PRIVATE", label: "Private — invite code required" },
];

export function CreateRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const createRoom = useCreateRoom();
  const isSubmitting = createRoom.isPending;
  const apiError = isApiError(createRoom.error) ? createRoom.error : null;

  const form = useZodForm({
    schema: createRoomSchema,
    initialValues: { name: "", subject: "", visibility: "PUBLIC" },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      createRoom.mutate(values);
    },
  });

  const subjectProps = form.getFieldProps("subject");
  const visibilityProps = form.getFieldProps("visibility");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a room"
      description="Give it a name and a subject. You get a code to share right after."
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
                value={
                  SUBJECT_OPTIONS.find(
                    (option) => option.value === subjectProps.value,
                  ) ?? null
                }
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
                  VISIBILITY_OPTIONS.find(
                    (option) => option.value === visibilityProps.value,
                  ) ?? VISIBILITY_OPTIONS[0]
                }
                onChange={(option) =>
                  visibilityProps.onChange({
                    target: { value: option?.value ?? "PUBLIC" },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                onBlur={visibilityProps.onBlur}
                isDisabled={isSubmitting}
                isSearchable={true}
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
                Create room
              </Button>
            </div>
          </FieldGroup>
        </fieldset>
      </form>
    </Modal>
  );
}
