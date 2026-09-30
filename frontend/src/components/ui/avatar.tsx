import { cn } from "@/lib/utils";

/** Up to two letters, so a missing image still identifies someone. */
export function initialsOf(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "?";
}

export function Avatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  const base = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
    "size-9 bg-primary/10 text-xs font-semibold text-primary select-none",
    className,
  );

  if (src) {
    return (
      // Avatars are arbitrary user-supplied URLs, which next/image cannot
      // optimise without whitelisting every possible host.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={cn(base, "object-cover")} />
    );
  }

  return (
    <span className={base} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}
