import { cn } from "@/lib/utils";

export function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "destructive" | "success";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variant === "destructive" &&
          "border-destructive/40 bg-destructive/5 text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-medium", className)} {...props} />;
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("mt-1 opacity-90", className)} {...props} />;
}
