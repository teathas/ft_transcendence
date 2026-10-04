import Link from "next/link";

import { BrandWordmark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { EXTERNAL, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Classroom", href: "#classroom" },
  { label: "How it works", href: "#how-it-works" },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="lg:col-span-2">
          <BrandWordmark />
          <p className="mt-3 max-w-xs text-sm text-pretty text-muted-foreground">
            {siteConfig.description}
          </p>
          <a
            href={EXTERNAL.github}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
            View on GitHub
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 flex flex-col gap-2">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Get started</p>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link
                href={routes.createRoom}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Create a Room
              </Link>
            </li>
            <li>
              <Link
                href={routes.joinRoom}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Join a Room
              </Link>
            </li>
            <li>
              <Link
                href={routes.login}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container>
        <div className="border-t py-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. A 42 school project.
          </p>
        </div>
      </Container>
    </footer>
  );
}
