"use client";

import { createContext, use, useEffect, useState } from "react";
import { CircleCheck, X } from "lucide-react";

import { useDict } from "@/i18n/client";

const ToastContext = createContext<(message: string) => void>(() => {});

/**
 * One toast at a time, gone after five seconds. It lives above the router, so
 * a message raised just before a redirect is still on screen on the next page.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const d = useDict();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <ToastContext value={setMessage}>
      {children}

      {message && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-sm items-center gap-3 rounded-xl border bg-card p-4 shadow-lg shadow-black/10 sm:inset-x-auto sm:end-4 sm:mx-0 dark:shadow-black/40"
        >
          <CircleCheck
            className="size-5 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
          <p className="flex-1 text-sm">{message}</p>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label={d.common.close}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </ToastContext>
  );
}

/** `const toast = useToast(); toast("Saved")`. */
export function useToast() {
  return use(ToastContext);
}
