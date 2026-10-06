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
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { accountSchema } from "../schemas";
import { SectionCard } from "./section-card";

export function AccountForm({ user }: { user: User }) {
  const updateProfile = useUpdateProfile();
  const isSubmitting = updateProfile.isPending;
  const apiError = isApiError(updateProfile.error) ? updateProfile.error : null;

  const form = useZodForm({
    schema: accountSchema,
    initialValues: { username: user.username, bio: user.bio ?? "" },
    externalErrors: apiError?.fieldErrors,
    onSubmit: (values) => {
      if (isSubmitting) return;
      updateProfile.mutate(values);
    },
  });

  const isUnchanged =
    form.values.username.trim() === user.username &&
    form.values.bio.trim() === (user.bio ?? "");

  return (
    <SectionCard
      title="Account details"
      description="Your username is how other people find you in a room."
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
                <AlertDescription>
                  Your details have been saved.
                </AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel {...form.getLabelProps("username")}>
                Username
              </FieldLabel>
              <Input
                {...form.getFieldProps("username")}
                autoComplete="username"
                maxLength={20}
              />
              <FieldDescription>Between 3 and 20 characters.</FieldDescription>
              <FieldError {...form.getErrorProps("username")} />
            </Field>

            <Field>
              <FieldLabel {...form.getLabelProps("bio")}>Bio</FieldLabel>
              <Input
                {...form.getFieldProps("bio")}
                maxLength={280}
                placeholder="Maths teacher, fond of a well-drawn parabola."
              />
              <FieldDescription>
                Optional, up to 280 characters.
              </FieldDescription>
              <FieldError {...form.getErrorProps("bio")} />
            </Field>

            {/* The API has no route to change an email address. */}
            <Field>
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input
                id="profile-email"
                value={user.email}
                readOnly
                disabled
                autoComplete="email"
              />
              <FieldDescription>
                Used to sign in. Contact an administrator to change it.
              </FieldDescription>
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
              Save changes
            </Button>
          </FieldGroup>
        </fieldset>
      </form>
    </SectionCard>
  );
}
