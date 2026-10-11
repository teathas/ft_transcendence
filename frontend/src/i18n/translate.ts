/**
 * Fills in `{placeholders}`: `t("Showing {from}–{to}", { from: 1, to: 12 })`.
 * A placeholder with no matching value is left as written.
 */
export function t(
  phrase: string,
  values: Record<string, string | number>,
): string {
  return phrase.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
