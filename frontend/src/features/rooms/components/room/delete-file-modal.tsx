"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { isApiError } from "@/lib/api";

export function DeleteFileModal({
  name,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  /** The file to delete; the modal is open while there is one. */
  name: string | null;
  pending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const d = useDict();
  const apiError = isApiError(error) ? error : null;

  return (
    <Modal
      open={name !== null}
      onClose={onClose}
      title={d.room.deleteFileConfirm.title}
      description={t(d.room.deleteFileConfirm.description, {
        name: name ?? "",
      })}
    >
      <div className="flex flex-col gap-4">
        {(apiError || error != null) && (
          <Alert variant="destructive">
            <AlertDescription>
              {apiError?.message ?? d.room.fileFailed}
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
            {d.room.deleteFileConfirm.confirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
