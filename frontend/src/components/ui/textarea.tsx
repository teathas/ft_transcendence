import { cn } from "@/lib/utils";

/** Same look as `Input`, for text that runs over several lines. */
export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground/70",
        "min-h-20 w-full resize-y rounded-lg border px-3 py-2 text-sm shadow-xs",
        "transition-[color,box-shadow,border-color]",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none",
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
