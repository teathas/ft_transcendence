import { cn } from "@/lib/utils";

export function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-5", className)} {...props} />;
}

export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function FieldError({
  className,
  messages,
  ...props
}: React.ComponentProps<"p"> & { messages?: string[] }) {
  if (!messages?.length) return null;

  return (
    <p
      role="alert"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {messages.join(", ")}
    </p>
  );
}
