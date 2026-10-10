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
import { useUpdateProfile } from "@/features/auth/hooks/use-auth";
import type { User } from "@/features/auth/types";
import { useDict } from "@/i18n/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { accountSchema } from "../schemas";
import { SectionCard } from "./section-card";

export function AccountForm({ user }: { user: User }) {
  const d = useDict();
  const updateProfile = useUpdateProfile();
  const isSubmitting = updateProfile.isPending;
  const apiError = isApiError(updateProfile.error) ? updateProfile.error : null;

  const form = useZodForm({
    schema: accountSchema,
    initialValues: { username: user.username, email: user.email },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      updateProfile.mutate(values);
    },
  });

  const isUnchanged =
    form.values.username.trim() === user.username &&
    form.values.email.trim() === user.email;

  return (
    <SectionCard
      title={d.profile.account.title}
      description={d.profile.account.description}
    >
      <form onSubmit={form.handleSubmit} noValidate>
        <fieldset disabled={isSubmitting}>
          <FieldGroup>
            {apiError && !apiError.fieldErrors && (
              <Alert variant="destructive">
                <AlertDescription>{apiError.message}</AlertDescription>
              </Alert>
            )}

            {updateProfile.isSuccess && isUnchanged && (
              <Alert variant="success">
                <AlertDescription>{d.profile.account.saved}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel {...form.getLabelProps("username")}>
                {d.profile.account.username}
              </FieldLabel>
              <Input
                {...form.getFieldProps("username")}
                autoComplete="username"
              />
              <FieldError {...form.getErrorProps("username")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("email")}>
                {d.profile.account.email}
              </FieldLabel>
              <Input
                {...form.getFieldProps("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
              />
              <FieldDescription>{d.profile.account.emailHint}</FieldDescription>
              <FieldError {...form.getErrorProps("email")} />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting || isUnchanged}
              className="self-start"
            >
              {isSubmitting && (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {d.common.saveChanges}
            </Button>
          </FieldGroup>
        </fieldset>
      </form>
    </SectionCard>
  );
}
