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
import { Modal } from "@/components/ui/modal";
import { Select, type SelectOption } from "@/components/ui/select";
import { useDict } from "@/i18n/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { useCreateRoom } from "../hooks/use-rooms";
import { SUBJECTS } from "../mocks";
import { createRoomSchema } from "../schemas";
import { useSubjectLabel } from "../subject-label";

export function CreateRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const d = useDict();
  const subjectLabel = useSubjectLabel();
  const subjectOptions: SelectOption[] = SUBJECTS.map((subject) => ({
    value: subject,
    label: subjectLabel(subject),
  }));
  const createRoom = useCreateRoom();
  const isSubmitting = createRoom.isPending;
  const apiError = isApiError(createRoom.error) ? createRoom.error : null;

  const form = useZodForm({
    schema: createRoomSchema,
    initialValues: { name: "", subject: "" },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      createRoom.mutate(values);
    },
  });

  const subjectProps = form.getFieldProps("subject");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={d.rooms.create.title}
      description={d.rooms.create.description}
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
                {d.rooms.create.submit}
              </Button>
            </div>
          </FieldGroup>
        </fieldset>
      </form>
    </Modal>
  );
}
