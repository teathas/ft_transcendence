import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonStyles({ variant: "ghost", size: "sm" })}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/login"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            Sign in
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
