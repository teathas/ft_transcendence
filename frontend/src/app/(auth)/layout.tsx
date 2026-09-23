import Link from "next/link";

import { BrandWordmark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      {/* Presentational panel, desktop only. */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-muted p-10 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_45%,#000,transparent)] [background-size:36px_36px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -bottom-32 size-96 rounded-full bg-primary/10 blur-3xl"
        />

        <Link href="/" className="relative w-fit rounded-md">
          <BrandWordmark />
        </Link>

        <div className="relative max-w-md">
          <p className="text-2xl font-semibold tracking-tight text-balance">
            {siteConfig.tagline}
          </p>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
      </aside>

      <main className="flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4 sm:px-8 lg:justify-end">
          <Link href="/" className="rounded-md lg:hidden">
            <BrandWordmark />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
