import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border bg-transparent hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
} as const;

const SIZES = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-9 gap-2 px-4 text-sm",
  lg: "h-11 gap-2 px-6 text-base",
  icon: "size-9",
} as const;

const BASE =
  "inline-flex shrink-0 items-center justify-center rounded-md font-medium " +
  "transition-colors disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0";

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

/**
 * Class-name-only version of `Button`, for elements that must not be a
 * `<button>` — `next/link`, `<a>`, `<label>`.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
