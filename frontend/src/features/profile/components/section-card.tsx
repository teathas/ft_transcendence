import { cn } from "@/lib/utils";

/** Consistent shell for each block of the profile page. */
export function SectionCard({
  title,
  description,
  children,
  className,
  tone = "default",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "danger";
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card p-5 sm:p-6",
        tone === "danger" && "border-destructive/40",
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-1">
        <h2
          className={cn(
            "font-semibold tracking-tight",
            tone === "danger" && "text-destructive",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
