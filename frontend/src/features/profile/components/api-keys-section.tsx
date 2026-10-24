"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonStyles } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";
import { env } from "@/lib/env";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { ApiKeySummary, CreatedApiKey } from "../api/api-keys.api";
import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
} from "../hooks/use-api-keys";
import { SectionCard } from "./section-card";

export function ApiKeysSection() {
  const d = useDict();
  const format = useFormat();
  const keys = useApiKeys();
  const createKey = useCreateApiKey();
  const revokeKey = useRevokeApiKey();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [created, setCreated] = useState<CreatedApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState<ApiKeySummary | null>(null);
  const [openedAt] = useState(() => Date.now());

  const createError = isApiError(createKey.error) ? createKey.error : null;
  const revokeError = isApiError(revokeKey.error) ? revokeKey.error : null;

  function closeCreate() {
    if (createKey.isPending) return;
    setCreateOpen(false);
    setCreated(null);
    setCopied(false);
    setName("");
    setExpiresAt("");
    createKey.reset();
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || createKey.isPending) return;

    createKey.mutate(
      {
        name: name.trim(),
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      },
      { onSuccess: setCreated },
    );
  }

  async function copyCreatedKey() {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.key);
      setCopied(true);
    } catch {
      // The key remains selected/readable when clipboard access is blocked.
    }
  }

  return (
    <SectionCard
      title={d.profile.apiKeys.title}
      description={d.profile.apiKeys.description}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`${env.apiUrl}/docs`}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            {d.profile.apiKeys.documentation}
          </a>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            {d.profile.apiKeys.create}
          </Button>
        </div>

        {keys.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : keys.isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              {isApiError(keys.error)
                ? keys.error.message
                : d.profile.apiKeys.loadError}
            </AlertDescription>
          </Alert>
        ) : keys.data.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-5 py-8 text-center">
            <KeyRound
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">{d.profile.apiKeys.empty}</p>
            <p className="max-w-md text-xs text-muted-foreground">
              {d.profile.apiKeys.emptyHint}
            </p>
          </div>
        ) : (
          <ul className="divide-y rounded-lg border">
            {keys.data.map((key) => {
              const expired =
                key.expiresAt !== null &&
                new Date(key.expiresAt).getTime() <= openedAt;
              const inactive = key.revokedAt !== null || expired;
              return (
                <li
                  key={key.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <KeyRound className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{key.name}</p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          inactive
                            ? "bg-muted text-muted-foreground"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        {key.revokedAt
                          ? d.profile.apiKeys.revoked
                          : expired
                            ? d.profile.apiKeys.expired
                            : d.profile.apiKeys.active}
                      </span>
                    </div>
                    <p
                      className="mt-1 font-mono text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      {key.prefix}••••••••
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {key.lastUsedAt
                        ? `${d.profile.apiKeys.lastUsed} ${format.relativeTime(key.lastUsedAt)}`
                        : d.profile.apiKeys.neverUsed}
                      {key.expiresAt &&
                        ` · ${d.profile.apiKeys.expires} ${format.date(key.expiresAt)}`}
                    </p>
                  </div>
                  {!key.revokedAt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start text-destructive hover:text-destructive sm:self-center"
                      onClick={() => {
                        revokeKey.reset();
                        setRevoking(key);
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      {d.profile.apiKeys.revoke}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={closeCreate}
        title={
          created
            ? d.profile.apiKeys.createdTitle
            : d.profile.apiKeys.createTitle
        }
        description={
          created
            ? d.profile.apiKeys.createdDescription
            : d.profile.apiKeys.createDescription
        }
      >
        {created ? (
          <div className="flex flex-col gap-4">
            <Alert variant="success">
              <AlertDescription>
                {d.profile.apiKeys.copyWarning}
              </AlertDescription>
            </Alert>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
              <code
                className="min-w-0 flex-1 overflow-x-auto text-xs whitespace-nowrap select-all"
                dir="ltr"
              >
                {created.key}
              </code>
              <Button
                size="icon"
                variant="outline"
                aria-label={d.profile.apiKeys.copy}
                title={d.profile.apiKeys.copy}
                onClick={() => void copyCreatedKey()}
              >
                {copied ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            <Button onClick={closeCreate}>{d.common.close}</Button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {createError && (
              <Alert variant="destructive">
                <AlertDescription>{createError.message}</AlertDescription>
              </Alert>
            )}
            <Field>
              <FieldLabel htmlFor="api-key-name">
                {d.profile.apiKeys.name}
              </FieldLabel>
              <Input
                id="api-key-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                autoFocus
                placeholder={d.profile.apiKeys.namePlaceholder}
                required
              />
              <FieldDescription>{d.profile.apiKeys.nameHint}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="api-key-expiration">
                {d.profile.apiKeys.expiration}
              </FieldLabel>
              <Input
                id="api-key-expiration"
                type="datetime-local"
                value={expiresAt}
                min={new Date(openedAt + 60_000).toISOString().slice(0, 16)}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
              <FieldDescription>
                {d.profile.apiKeys.expirationHint}
              </FieldDescription>
            </Field>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={closeCreate}
                disabled={createKey.isPending}
              >
                {d.common.cancel}
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || createKey.isPending}
              >
                {createKey.isPending && (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {d.profile.apiKeys.create}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={revoking !== null}
        onClose={() => {
          if (!revokeKey.isPending) setRevoking(null);
        }}
        title={d.profile.apiKeys.revokeTitle}
        description={d.profile.apiKeys.revokeDescription}
      >
        <div className="flex flex-col gap-4">
          {revokeError && (
            <Alert variant="destructive">
              <AlertDescription>{revokeError.message}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              disabled={revokeKey.isPending}
              onClick={() => setRevoking(null)}
            >
              {d.common.cancel}
            </Button>
            <Button
              variant="destructive"
              disabled={revokeKey.isPending}
              onClick={() => {
                if (!revoking) return;
                revokeKey.mutate(revoking.id, {
                  onSuccess: () => setRevoking(null),
                });
              }}
            >
              {revokeKey.isPending && (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {d.profile.apiKeys.confirmRevoke}
            </Button>
          </div>
        </div>
      </Modal>
    </SectionCard>
  );
}
