import Link from "next/link";

import { BrandWordmark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";

const SECTIONS = [
  { label: "Features", href: "#features" },
  { label: "Classroom", href: "#classroom" },
  { label: "How it works", href: "#how-it-works" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-6">
        <Link href={routes.home} className="rounded-md">
          <BrandWordmark />
        </Link>

        {/* In-page anchors, so plain <a> rather than typed <Link>. */}
        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href={routes.login}
            className={buttonStyles({
              variant: "ghost",
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Sign in
          </Link>
          <Link
            href={routes.createRoom}
            className={buttonStyles({ size: "sm" })}
          >
            Create a Room
          </Link>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
