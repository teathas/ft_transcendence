"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Password field with a show/hide toggle.
 *
 * The toggle stays keyboard reachable and reports its state through
 * `aria-pressed`, so it is usable without a mouse.
 */
export function PasswordInput({
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        disabled={disabled}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
      />

      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        disabled={disabled}
        aria-pressed={visible}
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        className={cn(
          "absolute inset-y-0 right-0 flex items-center rounded-r-md px-3",
          "text-muted-foreground transition-colors hover:text-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
