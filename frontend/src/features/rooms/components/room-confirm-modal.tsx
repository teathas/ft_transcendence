"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";

/** One "are you sure" for the destructive room actions (delete, leave). */
export function RoomConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const d = useDict();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="flex flex-col gap-4">
        {error != null && (
          <Alert variant="destructive">
            <AlertDescription>
              {isApiError(error) ? error.message : d.common.tryAgain}
            </AlertDescription>
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
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
