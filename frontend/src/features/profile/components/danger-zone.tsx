"use client";

import { useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";

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
import { useDeleteAccount } from "@/features/auth/hooks/use-auth";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { SectionCard } from "./section-card";

export function DangerZone({ username }: { username: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const deleteAccount = useDeleteAccount();
  const isSubmitting = deleteAccount.isPending;
  const apiError = isApiError(deleteAccount.error) ? deleteAccount.error : null;

  // Typing the username is the safeguard, so the schema depends on it.
  const schema = useMemo(
    () =>
      z
        .object({ confirmation: z.string() })
        .refine((values) => values.confirmation.trim() === username, {
          path: ["confirmation"],
          error: `Type “${username}” exactly to confirm`,
        }),
    [username],
  );

  const form = useZodForm({
    schema,
    initialValues: { confirmation: "" },
    onSubmit: () => {
      if (isSubmitting) return;
      deleteAccount.mutate();
    },
  });

  return (
    <SectionCard
      tone="danger"
      title="Delete account"
      description="Your rooms, boards and messages are removed for everyone. This cannot be undone."
    >
      {!isConfirming ? (
        <Button variant="destructive" onClick={() => setIsConfirming(true)}>
          Delete my account
        </Button>
      ) : (
        <form onSubmit={form.handleSubmit} noValidate>
          <fieldset disabled={isSubmitting}>
            <FieldGroup>
              {apiError && (
                <Alert variant="destructive">
                  <AlertDescription>{apiError.message}</AlertDescription>
                </Alert>
              )}

              <Field>
                <FieldLabel {...form.getLabelProps("confirmation")}>
                  Confirm your username
                </FieldLabel>
                <Input
                  {...form.getFieldProps("confirmation")}
                  autoComplete="off"
                  placeholder={username}
                  autoFocus
                />
                <FieldDescription>
                  Type <strong className="text-foreground">{username}</strong>{" "}
                  to unlock the button below.
                </FieldDescription>
                <FieldError {...form.getErrorProps("confirmation")} />
              </Field>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting || !form.isValid}
                >
                  {isSubmitting && (
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Permanently delete
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  onClick={() => setIsConfirming(false)}
                >
                  Cancel
                </Button>
              </div>
            </FieldGroup>
          </fieldset>
        </form>
      )}
    </SectionCard>
  );
}
