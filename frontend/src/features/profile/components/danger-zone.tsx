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
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { useZodForm } from "@/hooks/use-zod-form";
import { isApiError } from "@/lib/api";

import { SectionCard } from "./section-card";

export function DangerZone({ username }: { username: string }) {
  const d = useDict();
  const hint = d.profile.danger.confirmHint;
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
          error: t(hint, { username }),
        }),
    [username, hint],
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
      title={d.profile.danger.title}
      description={d.profile.danger.description}
    >
      {!isConfirming ? (
        <Button variant="destructive" onClick={() => setIsConfirming(true)}>
          {d.profile.danger.submit}
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
                  {d.profile.danger.confirmLabel}
                </FieldLabel>
                <Input
                  {...form.getFieldProps("confirmation")}
                  autoComplete="off"
                  placeholder={username}
                  autoFocus
                />
                <FieldDescription>
                  {t(d.profile.danger.confirmDescription, { username })}
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
                  {d.profile.danger.permanentlyDelete}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  onClick={() => setIsConfirming(false)}
                >
                  {d.common.cancel}
                </Button>
              </div>
            </FieldGroup>
          </fieldset>
        </form>
      )}
    </SectionCard>
  );
}
