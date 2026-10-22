"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Menu } from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { BrandWordmark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link, useBarePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Lets a page's own top bar (the room's) open the shell's drawer. */
const NavDrawerContext = createContext<{ isOpen: boolean; open: () => void }>({
  isOpen: false,
  open: () => {},
});

export function useNavDrawer() {
  return useContext(NavDrawerContext);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const d = useDict();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useBarePathname();
  // A room has its own header and wants every pixel, so the bar steps aside.
  // On desktop the sidebar does too: the room's menu button opens the drawer.
  const inRoom = /^\/rooms\/[^/]+$/.test(pathname);

  const drawerRef = useRef<HTMLElement>(null);
  // Whatever opened the drawer gets the focus back when it closes.
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);
  const drawer = useMemo(() => ({ isOpen, open }), [isOpen, open]);

  // Escape closes the drawer, the way any dialog should.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Focus moves into the dialog, then back out. After a navigation the
  // trigger is gone from the page and `focus()` does nothing.
  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  return (
    <NavDrawerContext.Provider value={drawer}>
      <div className="flex flex-1">
        <aside
          id="app-sidebar"
          data-rail
          className={cn(
            "sticky top-0 z-30 hidden h-svh w-64 shrink-0 border-e bg-card rail-collapsed:w-18",
            !inRoom && "lg:block",
          )}
        >
          <AppSidebar />
        </aside>

        {/* Drawer: phones everywhere, and every screen size inside a room. */}
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity",
            !inRoom && "lg:hidden",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
        <aside
          ref={drawerRef}
          id="app-drawer"
          role="dialog"
          aria-modal={isOpen}
          aria-label={d.nav.navigation}
          inert={!isOpen}
          tabIndex={-1}
          className={cn(
            "fixed inset-y-0 start-0 z-50 w-72 border-e bg-card outline-none transition-transform duration-200",
            !inRoom && "lg:hidden",
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
              aria-controls="app-drawer"
              onClick={open}
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
    </NavDrawerContext.Provider>
  );
}
