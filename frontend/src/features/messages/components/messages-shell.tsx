"use client";

import { useBarePathname } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

import { ConversationList } from "./conversation-list";

/**
 * Two panes: who you talk to, and the talk. On a phone only one shows at a
 * time — the list at /messages, the thread once a friend is picked.
 */
export function MessagesShell({ children }: { children: React.ReactNode }) {
  const pathname = useBarePathname();
  const inThread = pathname.startsWith(`${routes.messages}/`);
  const activeId = inThread ? pathname.split("/").pop() : undefined;

  return (
    <div className="mx-auto flex h-[calc(100svh-3.5rem)] w-full max-w-6xl lg:h-svh lg:p-6">
      <div className="flex min-w-0 flex-1 overflow-hidden bg-card lg:rounded-2xl lg:border lg:shadow-sm">
        <aside
          className={cn(
            "w-full shrink-0 flex-col border-e md:w-80",
            inThread ? "hidden md:flex" : "flex",
          )}
        >
          <ConversationList activeId={activeId} />
        </aside>

        <section
          className={cn(
            "min-w-0 flex-1 flex-col",
            inThread ? "flex" : "hidden md:flex",
          )}
        >
          {children}
        </section>
      </div>
    </div>
  );
}

