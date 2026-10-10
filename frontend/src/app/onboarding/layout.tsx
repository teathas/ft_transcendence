import Link from "next/link";

import { BrandWordmark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { routes } from "@/config/routes";

export default function OnboardingLayout({
  children,
}: LayoutProps<"/onboarding">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href={routes.home} className="rounded-md">
          <BrandWordmark />
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 justify-center px-4 py-8 sm:px-8 sm:py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
