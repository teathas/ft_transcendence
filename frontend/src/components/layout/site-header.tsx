import { BrandWordmark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { getDict } from "@/i18n/server";

export async function SiteHeader() {
  const d = await getDict();

  const sections = [
    { label: d.landing.sections.features, href: routes.features },
    { label: d.landing.sections.classroom, href: routes.classroom },
    { label: d.landing.sections.howItWorks, href: routes.howItWorks },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-6">
        <Link href={routes.home} className="rounded-md">
          <BrandWordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 sm:gap-3">
          <Link
            href={routes.login}
            className={buttonStyles({
              variant: "ghost",
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            {d.landing.header.signIn}
          </Link>
          <Link
            href={routes.createRoom}
            className={buttonStyles({ size: "sm" })}
          >
            {d.landing.header.createRoom}
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
