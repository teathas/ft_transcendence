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
        "border-input bg-background placeholder:text-muted-foreground",
        "h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:outline-destructive",
        className,
      )}
      {...props}
    />
  );
}
