"use client";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDict } from "@/i18n/client";

export function LogoutModal({
  open,
  pending,
  onClose,
  onConfirm,
}: {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const d = useDict();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={d.nav.signOutConfirm.title}
      description={d.nav.signOutConfirm.description}
    >
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose} disabled={pending}>
          {d.common.cancel}
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={pending}>
          {pending && (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          )}
          {d.nav.signOut}
        </Button>
      </div>
    </Modal>
  );
}
