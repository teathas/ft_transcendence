export const ELLIPSIS = "…" as const;

export type PageItem = number | typeof ELLIPSIS;

/**
 * Page numbers to render, collapsing long runs: `1 2 3 … 10`.
 *
 * Always keeps the first and last page, plus `siblings` either side of the
 * current one, so the control never changes width unexpectedly.
 */
export function pageRange(
  current: number,
  total: number,
  siblings = 1,
): PageItem[] {
  if (total <= 1) return total === 1 ? [1] : [];

  // First + last + current + 2 ellipses + siblings on both sides.
  const maxSlots = siblings * 2 + 5;
  if (total <= maxSlots) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const count = siblings * 2 + 3;
    return [
      ...Array.from({ length: count }, (_, index) => index + 1),
      ELLIPSIS,
      total,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const count = siblings * 2 + 3;
    return [
      1,
      ELLIPSIS,
      ...Array.from({ length: count }, (_, index) => total - count + 1 + index),
    ];
  }

  return [
    1,
    ELLIPSIS,
    ...Array.from({ length: right - left + 1 }, (_, index) => left + index),
    ELLIPSIS,
    total,
  ];
}
