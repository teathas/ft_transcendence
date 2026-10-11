"use client";

import { Check, Languages } from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useDict, useLocale } from "@/i18n/client";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { stripLocale } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Switching language is a navigation: the locale lives in the URL, so the page
 * is re-rendered by the server in the new language and the address stays
 * shareable. The proxy writes the preference to a cookie on the way in, which
 * is what makes a later bare URL land in the same language.
 */
export function LanguageSwitcher({
  className,
  side,
}: {
  className?: string;
  side?: "top" | "bottom";
}) {
  const d = useDict();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;

    const bare = stripLocale(pathname);
    // Read at click time rather than with `useSearchParams`, which would opt
    // every page holding this switcher out of static rendering.
    const search = typeof window === "undefined" ? "" : window.location.search;

    router.replace(`/${next}${bare === "/" ? "" : bare}${search}` as Route);
  }

  return (
    <Dropdown
      label={d.language.change}
      side={side}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          variant="ghost"
          size="sm"
          aria-label={d.language.change}
          className={cn("gap-1.5", className)}
        >
          <Languages className="size-4" aria-hidden="true" />
          <span className="text-xs font-medium uppercase">{locale}</span>
        </Button>
      )}
    >
      {locales.map((candidate) => (
        <DropdownItem
          key={candidate}
          onClick={() => switchTo(candidate)}
          aria-current={candidate === locale ? "true" : undefined}
        >
          <Check
            className={cn(
              "size-4 shrink-0",
              candidate === locale ? "opacity-100" : "opacity-0",
            )}
            aria-hidden="true"
          />
          {/* Each name in its own language and its own direction, so Arabic
              reads correctly even inside the English menu. */}
          <span dir={candidate === "ar" ? "rtl" : "ltr"}>
            {localeNames[candidate]}
          </span>
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
