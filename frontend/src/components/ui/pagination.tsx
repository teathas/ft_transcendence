"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Select, type SelectOption } from "@/components/ui/select";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";
import { ELLIPSIS, pageRange } from "@/lib/pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [6, 12, 24, 48] as const;

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
  const d = useDict();
  const pageSizes: SelectOption[] = PAGE_SIZES.map((size) => ({
    value: String(size),
    label: t(d.pagination.perPage, { count: size }),
  }));

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav
      aria-label={d.pagination.label}
      className="flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <p className="order-2 text-sm text-muted-foreground sm:order-1">
        {totalItems === 0
          ? d.pagination.empty
          : t(d.pagination.showing, { from, to, total: totalItems })}
      </p>

      <div className="order-1 flex flex-wrap items-center justify-center gap-3 sm:order-2">
        <Select
          className="w-34"
          aria-label={d.pagination.perPageLabel}
          options={pageSizes}
          value={pageSizes.find((option) => option.value === String(pageSize))}
          onChange={(option) =>
            option && onPageSizeChange(Number(option.value))
          }
          isSearchable={false}
        />

        <div className="flex items-center gap-1">
          <PageButton
            aria-label={d.pagination.previous}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
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
                aria-label={t(d.pagination.page, { page: item })}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PageButton>
            ),
          )}

          <PageButton
            aria-label={d.pagination.next}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight
              className="size-4 rtl:rotate-180"
              aria-hidden="true"
            />
          </PageButton>
        </div>
      </div>
    </nav>
  );
}
