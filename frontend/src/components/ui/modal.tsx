"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

/**
 * Built on the native `<dialog>`: focus trapping, Escape, and making the rest
 * of the page inert all come from the browser rather than from us.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const d = useDict();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Fires for Escape and for programmatic closes alike.
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      // Clicking the backdrop means clicking the dialog element itself.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        // `overflow-visible`: a <dialog> clips its overflow by default, which
        // cut off the subject list — a menu taller than the form around it.
        "m-auto w-[calc(100%-2rem)] max-w-md overflow-visible rounded-xl border bg-card p-0 text-foreground",
        "shadow-2xl shadow-black/10 backdrop:bg-black/50 dark:shadow-black/50",
        "open:animate-fade-up",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b p-5">
        <div className="flex flex-col gap-1">
          <h2 id="modal-title" className="font-semibold tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label={d.common.close}
          onClick={onClose}
          className="-me-1 -mt-1 shrink-0"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="p-5">{children}</div>
    </dialog>
  );
}
