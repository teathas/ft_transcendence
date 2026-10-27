import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground/70",
        "h-11 w-full rounded-lg border px-3 py-2 text-sm shadow-xs",
        "transition-[color,box-shadow,border-color]",
        // Ring instead of the global outline, so it hugs the rounded corners.
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none",
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
