import { env } from "@/lib/env";
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
    // Uploaded avatars come back as `/uploads/avatars/…`, a path served by the
    // API; a local preview (`blob:`) or a full URL is already absolute.
    const url = src.startsWith("/") ? `${env.apiUrl}${src}` : src;
    return (
      // next/image cannot optimise an arbitrary host without whitelisting it.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className={cn(base, "object-cover")} />
    );
  }

  return (
    <span className={base} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}
