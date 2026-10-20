"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";

export function DeleteMessageModal({
  open,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  pending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const d = useDict();
  const apiError = isApiError(error) ? error : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={d.messages.deleteConfirm.title}
      description={d.messages.deleteConfirm.description}
    >
      <div className="flex flex-col gap-4">
        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{apiError.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            {d.common.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {d.messages.deleteConfirm.confirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
