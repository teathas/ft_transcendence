"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Select, type SelectOption } from "@/components/ui/select";
import { ELLIPSIS, pageRange } from "@/lib/pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZES: SelectOption[] = [
  { value: "6", label: "6 / page" },
  { value: "12", label: "12 / page" },
  { value: "24", label: "24 / page" },
  { value: "48", label: "48 / page" },
];

function PageButton({
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border text-sm transition-colors",
        active
          ? "border-primary bg-primary font-medium text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <p className="order-2 text-sm text-muted-foreground sm:order-1">
        {totalItems === 0
          ? "No rooms to show"
          : `Showing ${from}–${to} of ${totalItems}`}
      </p>

      <div className="order-1 flex flex-wrap items-center justify-center gap-3 sm:order-2">
        <Select
          className="w-34"
          aria-label="Rooms per page"
          options={PAGE_SIZES}
          value={PAGE_SIZES.find((option) => option.value === String(pageSize))}
          onChange={(option) =>
            option && onPageSizeChange(Number(option.value))
          }
          isSearchable={false}
        />

        <div className="flex items-center gap-1">
          <PageButton
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </PageButton>

          {pageRange(page, totalPages).map((item, index) =>
            item === ELLIPSIS ? (
              <span
                key={`gap-${index}`}
                aria-hidden="true"
                className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
              >
                {ELLIPSIS}
              </span>
            ) : (
              <PageButton
                key={item}
                active={item === page}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PageButton>
            ),
          )}

          <PageButton
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </PageButton>
        </div>
      </div>
    </nav>
  );
}
