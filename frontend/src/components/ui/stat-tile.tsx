export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
