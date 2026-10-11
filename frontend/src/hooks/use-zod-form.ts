"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { z, type ZodType } from "zod";

type FieldValues = Record<string, string>;

/**
 * Minimal form state bound to a zod schema.
 *
 * Validation runs against the *whole* schema on every keystroke so cross-field
 * rules (password confirmation) stay correct, but a message is only surfaced
 * once the user has left that field or tried to submit — errors never appear
 * while someone is still typing their first character.
 *
 * `externalErrors` folds server-side field errors into the same channel, so a
 * field looks and behaves identically whichever side rejected it.
 */
export function useZodForm<S extends ZodType, V extends FieldValues>({
  schema,
  initialValues,
  onSubmit,
  externalErrors,
}: {
  schema: S;
  initialValues: V;
  onSubmit: (values: z.infer<S>) => void;
  externalErrors?: Record<string, string[]>;
}) {
  type FieldName = keyof V & string;

  const formId = useId();
  const [values, setValues] = useState<V>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // A server error is stale as soon as the user edits the field it blamed.
  const [editedSinceSubmit, setEditedSinceSubmit] = useState<
    Partial<Record<FieldName, boolean>>
  >({});

  const fieldNames = useMemo(
    () => Object.keys(initialValues) as FieldName[],
    // `initialValues` is only read once, by useState.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const fieldId = useCallback(
    (name: FieldName) => `${formId}-${name}`,
    [formId],
  );

  /** Every schema error, whether or not it should be shown yet. */
  const schemaErrors = useMemo(() => {
    const result = schema.safeParse(values);
    if (result.success) return {} as Partial<Record<FieldName, string>>;

    const fieldErrors: Record<string, string[] | undefined> = z.flattenError(
      result.error,
    ).fieldErrors;

    const messages: Partial<Record<FieldName, string>> = {};
    for (const name of fieldNames) {
      const [first] = fieldErrors[name] ?? [];
      if (first) messages[name] = first;
    }
    return messages;
  }, [schema, values, fieldNames]);

  /** What the user should actually see: local rules first, then the server. */
  const errors = useMemo(() => {
    const visible: Partial<Record<FieldName, string>> = {};

    for (const name of fieldNames) {
      const local = schemaErrors[name];
      if (local && (submitAttempted || touched[name])) {
        visible[name] = local;
        continue;
      }

      if (local || editedSinceSubmit[name]) continue;
      const [fromServer] = externalErrors?.[name] ?? [];
      if (fromServer) visible[name] = fromServer;
    }

    return visible;
  }, [
    schemaErrors,
    touched,
    submitAttempted,
    editedSinceSubmit,
    externalErrors,
    fieldNames,
  ]);

  const getLabelProps = useCallback(
    (name: FieldName) => ({ htmlFor: fieldId(name) }),
    [fieldId],
  );

  const getErrorProps = useCallback(
    (name: FieldName) => {
      const message = errors[name];
      return {
        id: `${fieldId(name)}-error`,
        messages: message ? [message] : undefined,
      };
    },
    [errors, fieldId],
  );

  const getFieldProps = useCallback(
    (name: FieldName) => {
      const invalid = Boolean(errors[name]);
      return {
        id: fieldId(name),
        name,
        value: values[name],
        // A text box or a text area: only `.target.value` is read.
        onChange: (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          const next = event.target.value;
          setValues((prev) => ({ ...prev, [name]: next }));
          setEditedSinceSubmit((prev) => ({ ...prev, [name]: true }));
        },
        onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
        "aria-invalid": invalid ? (true as const) : undefined,
        "aria-describedby": invalid ? `${fieldId(name)}-error` : undefined,
      };
    },
    [values, errors, fieldId],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitAttempted(true);

      const result = schema.safeParse(values);
      if (!result.success) {
        // Move focus to the first problem so keyboard and screen-reader users
        // are not left guessing what failed.
        const firstInvalid = fieldNames.find((name) => schemaErrors[name]);
        if (firstInvalid) {
          document.getElementById(fieldId(firstInvalid))?.focus();
        }
        return;
      }

      // Only once the request is actually going out: any server error still on
      // screen belongs to the previous attempt and is about to be replaced.
      setEditedSinceSubmit({});
      onSubmit(result.data);
    },
    [schema, values, onSubmit, schemaErrors, fieldNames, fieldId],
  );

  return {
    values,
    /** Errors that should be displayed right now, keyed by field. */
    errors,
    isValid: Object.keys(schemaErrors).length === 0,
    submitAttempted,
    fieldId,
    getLabelProps,
    getFieldProps,
    getErrorProps,
    handleSubmit,
  };
}
