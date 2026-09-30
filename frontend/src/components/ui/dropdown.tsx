"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const DropdownContext = createContext<{ close: () => void }>({
  close: () => {},
});

/**
 * Small menu anchored to a trigger. Closes on Escape, on outside click and
 * after an item is chosen; focus returns to the trigger so keyboard users are
 * not dropped at the top of the page.
 */
export function Dropdown({
  trigger,
  children,
  align = "end",
  label,
}: {
  trigger: (props: {
    ref: React.Ref<HTMLButtonElement>;
    onClick: () => void;
    "aria-expanded": boolean;
    "aria-haspopup": "menu";
  }) => React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <div ref={rootRef} className="relative">
      {trigger({
        ref: triggerRef,
        onClick: () => setIsOpen((open) => !open),
        "aria-expanded": isOpen,
        "aria-haspopup": "menu",
      })}

      {isOpen && (
        <DropdownContext value={{ close }}>
          <div
            role="menu"
            aria-label={label}
            className={cn(
              "absolute z-50 mt-1.5 min-w-56 overflow-hidden rounded-lg border bg-card p-1",
              "shadow-lg shadow-black/5 dark:shadow-black/40",
              align === "end" ? "right-0" : "left-0",
            )}
          >
            {children}
          </div>
        </DropdownContext>
      )}
    </div>
  );
}

/** Runs its `onClick`, then closes the menu. */
export function DropdownItem({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { close } = use(DropdownContext);

  return (
    <button
      type="button"
      role="menuitem"
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
      className={cn(
        "flex w-full items-center gap-2.5 hover:bg-accent hover:text-accent-foreground",
        "rounded-md px-2.5 py-2 text-left text-sm transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1 h-px bg-border" />;
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}
