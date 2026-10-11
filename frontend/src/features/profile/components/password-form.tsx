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
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "@/features/auth/hooks/use-auth";
import { PasswordStrengthMeter } from "@/features/auth/components/password-strength-meter";
import { useDict } from "@/i18n/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { passwordChangeSchema } from "../schemas";
import { SectionCard } from "./section-card";

const INITIAL_VALUES = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function PasswordForm() {
  const d = useDict();
  const changePassword = useChangePassword();
  const isSubmitting = changePassword.isPending;
  const apiError = isApiError(changePassword.error)
    ? changePassword.error
    : null;

  const form = useZodForm({
    schema: passwordChangeSchema,
    initialValues: INITIAL_VALUES,
    externalErrors: apiError?.fieldErrors,
    onSubmit: ({ currentPassword, newPassword }) => {
      if (isSubmitting) return;
      changePassword.mutate({ currentPassword, newPassword });
    },
  });

  return (
    <SectionCard
      title={d.profile.password.title}
      description={d.profile.password.description}
    >
      <form onSubmit={form.handleSubmit} noValidate>
        <fieldset disabled={isSubmitting}>
          <FieldGroup>
            {apiError && !apiError.fieldErrors && (
              <Alert variant="destructive">
                <AlertDescription>{apiError.message}</AlertDescription>
              </Alert>
            )}

            {changePassword.isSuccess && (
              <Alert variant="success">
                <AlertDescription>
                  {d.profile.password.changed}
                </AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel {...form.getLabelProps("currentPassword")}>
                {d.profile.password.current}
              </FieldLabel>
              <PasswordInput
                {...form.getFieldProps("currentPassword")}
                autoComplete="current-password"
              />
              <FieldError {...form.getErrorProps("currentPassword")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("newPassword")}>
                {d.profile.password.new}
              </FieldLabel>
              <PasswordInput
                {...form.getFieldProps("newPassword")}
                autoComplete="new-password"
              />
              <FieldError {...form.getErrorProps("newPassword")} />
              {form.values.newPassword.length > 0 && (
                <PasswordStrengthMeter password={form.values.newPassword} />
              )}
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("confirmPassword")}>
                {d.profile.password.confirm}
              </FieldLabel>
              <PasswordInput
                {...form.getFieldProps("confirmPassword")}
                autoComplete="new-password"
              />
              <FieldError {...form.getErrorProps("confirmPassword")} />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="self-start"
            >
              {isSubmitting && (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {d.profile.password.submit}
            </Button>
          </FieldGroup>
        </fieldset>
      </form>
    </SectionCard>
  );
}
