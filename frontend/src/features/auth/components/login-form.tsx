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

import { useLogin } from "../hooks/use-auth";
import { loginSchema } from "../schemas";

const INITIAL_VALUES = { username: "", password: "" };

export function LoginForm() {
  const login = useLogin();
  const isSubmitting = login.isPending;

  const apiError = isApiError(login.error) ? login.error : null;
  const serverFieldErrors = apiError?.fieldErrors;

  const form = useZodForm({
    schema: loginSchema,
    initialValues: INITIAL_VALUES,
    externalErrors: serverFieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      login.mutate(values);
    },
  });

  const hasFieldLevelApiError = Boolean(
    serverFieldErrors && Object.keys(serverFieldErrors).length > 0,
  );

  return (
    <form onSubmit={form.handleSubmit} noValidate>
      <fieldset disabled={isSubmitting}>
        <FieldGroup>
          {apiError && !hasFieldLevelApiError && (
            <Alert variant="destructive">
              <AlertTitle>Could not sign you in</AlertTitle>
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
              placeholder="Your username"
              autoFocus
            />
            <FieldError {...form.getErrorProps("username")} />
          </Field>

          <Field>
            <FieldLabel {...form.getLabelProps("password")}>
              Password
            </FieldLabel>
            <PasswordInput
              {...form.getFieldProps("password")}
              autoComplete="current-password"
              placeholder="Your password"
            />
            <FieldError {...form.getErrorProps("password")} />
          </Field>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </FieldGroup>
      </fieldset>
    </form>
  );
}
