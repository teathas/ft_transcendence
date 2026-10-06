import { cn } from "@/lib/utils";

/**
 * A remote participant's pointer on the shared board. Decorative: hidden from
 * assistive tech, since the surrounding section already describes the idea.
 */
export function Cursor({
  name,
  color,
  className,
  style,
}: {
  name: string;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute flex items-start gap-1 select-none",
        className,
      )}
      style={style}
    >
      <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill={color}>
        <path
          d="M1.5 1.2 6.4 14l1.9-5.1L13.6 7z"
          stroke="white"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="rounded-md px-1.5 py-0.5 text-[10px] leading-tight font-medium text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </div>
  );
}
