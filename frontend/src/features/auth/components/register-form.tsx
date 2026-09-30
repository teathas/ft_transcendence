"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { useRegister } from "../hooks/use-auth";
import { registerFormSchema } from "../schemas";
import { PasswordStrengthMeter } from "./password-strength-meter";

const INITIAL_VALUES = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const register = useRegister();
  const isSubmitting = register.isPending;

  const apiError = isApiError(register.error) ? register.error : null;
  const serverFieldErrors = apiError?.fieldErrors;

  const form = useZodForm({
    schema: registerFormSchema,
    initialValues: INITIAL_VALUES,
    externalErrors: serverFieldErrors,
    onSubmit: ({ confirmPassword: _confirmPassword, ...payload }) => {
      // Belt and braces: the button is disabled, but a stray Enter key should
      // not be able to fire a second request either.
      if (isSubmitting) return;
      register.mutate(payload);
    },
  });

  const hasFieldLevelApiError = Boolean(
    serverFieldErrors && Object.keys(serverFieldErrors).length > 0,
  );

  return (
    <form onSubmit={form.handleSubmit} noValidate>
      {/* One disabled switch for every control while the request is in flight. */}
      <fieldset disabled={isSubmitting}>
        <FieldGroup>
          {apiError && !hasFieldLevelApiError && (
            <Alert variant="destructive">
              <AlertTitle>Could not create your account</AlertTitle>
              <AlertDescription>{apiError.message}</AlertDescription>
            </Alert>
          )}

          <Field>
            <FieldLabel {...form.getLabelProps("username")}>
              Username
            </FieldLabel>
            <Input
              {...form.getFieldProps("username")}
              autoComplete="username"
              placeholder="norminette"
              autoFocus
            />
            <FieldError {...form.getErrorProps("username")} />
          </Field>

          <Field>
            <FieldLabel {...form.getLabelProps("email")}>Email</FieldLabel>
            <Input
              {...form.getFieldProps("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@student.42.fr"
            />
            <FieldError {...form.getErrorProps("email")} />
          </Field>

          <Field>
            <FieldLabel {...form.getLabelProps("password")}>
              Password
            </FieldLabel>
            <PasswordInput
              {...form.getFieldProps("password")}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            <FieldError {...form.getErrorProps("password")} />
            {form.values.password.length > 0 && (
              <PasswordStrengthMeter password={form.values.password} />
            )}
          </Field>

          <Field>
            <FieldLabel {...form.getLabelProps("confirmPassword")}>
              Confirm password
            </FieldLabel>
            <PasswordInput
              {...form.getFieldProps("confirmPassword")}
              autoComplete="new-password"
              placeholder="Re-enter your password"
            />
            <FieldError {...form.getErrorProps("confirmPassword")} />
          </Field>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {isSubmitting ? "Creating account…" : "Register"}
          </Button>
        </FieldGroup>
      </fieldset>
    </form>
  );
}
