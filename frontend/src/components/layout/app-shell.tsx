"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { BrandWordmark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link, useBarePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const d = useDict();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useBarePathname();
  // A room has its own header and wants every pixel, so the bar steps aside.
  const inRoom = /^\/rooms\/[^/]+$/.test(pathname);

  // Escape closes the drawer, the way any dialog should.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="flex flex-1">
      <aside
        id="app-sidebar"
        data-rail
        className="sticky top-0 hidden h-svh w-64 shrink-0 border-e bg-card lg:block rail-collapsed:w-18"
      >
        <AppSidebar />
      </aside>

      {/* Mobile drawer */}
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal={isOpen}
        aria-label={d.nav.navigation}
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-72 border-e bg-card transition-transform duration-200 lg:hidden",
          // `translate` has no logical form, so the closed position is mirrored
          // explicitly: off to the left in LTR, off to the right in RTL.
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        <AppSidebar
          onNavigate={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={cn(
            "sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md lg:hidden",
            inRoom && "hidden",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label={d.nav.openNavigation}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
          <Link href={routes.dashboard} className="rounded-md" key={pathname}>
            <BrandWordmark />
          </Link>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
