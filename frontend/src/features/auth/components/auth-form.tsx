"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { z, type ZodType } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isApiError } from "@/lib/api";

export type AuthField = {
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
};

/**
 * Shared uncontrolled form shell for sign in / sign up.
 *
 * The values are validated with `schema` before the request goes out, so
 * `onSubmit` receives parsed, typed data. Zod's `fieldErrors` and the
 * backend's `ApiError.fieldErrors` share a shape, so both render identically.
 */
export function AuthForm<S extends ZodType>({
  schema,
  fields,
  submitLabel,
  isPending,
  error,
  onSubmit,
}: {
  schema: S;
  fields: AuthField[];
  submitLabel: string;
  isPending: boolean;
  error: unknown;
  onSubmit: (values: z.infer<S>) => void;
}) {
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>(
    {},
  );

  const apiError = isApiError(error) ? error : null;
  // Local messages win until the form is valid; then the backend's take over.
  const hasClientErrors = Object.keys(clientErrors).length > 0;
  const fieldErrors = hasClientErrors ? clientErrors : apiError?.fieldErrors;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const raw = Object.fromEntries(
      fields.map((field) => [field.name, String(data.get(field.name) ?? "")]),
    );

    const result = schema.safeParse(raw);
    if (!result.success) {
      setClientErrors(
        z.flattenError(result.error).fieldErrors as Record<string, string[]>,
      );
      return;
    }

    setClientErrors({});
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        {apiError && !fieldErrors && (
          <Alert variant="destructive">
            <AlertTitle>Could not continue</AlertTitle>
            <AlertDescription>{apiError.message}</AlertDescription>
          </Alert>
        )}

        {fields.map((field) => (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              aria-invalid={Boolean(fieldErrors?.[field.name]) || undefined}
              disabled={isPending}
            />
            <FieldError messages={fieldErrors?.[field.name]} />
          </Field>
        ))}

        <Button type="submit" disabled={isPending}>
          {isPending && <LoaderCircle className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
