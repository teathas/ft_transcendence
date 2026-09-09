import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const STACK = [
  {
    title: "Next.js 16 · App Router",
    description:
      "Route groups, typed routes and Turbopack. Middleware is now `proxy.ts`.",
  },
  {
    title: "Tailwind CSS v4",
    description:
      "Design tokens live in globals.css — no JS config. Dark mode is class-driven.",
  },
  {
    title: "TanStack Query",
    description:
      "One client per server render, shared in the browser. Keys in lib/query/keys.ts.",
  },
  {
    title: "Axios",
    description:
      "Single configured instance with auth headers, 401 refresh and normalised errors.",
  },
  {
    title: "ESLint + Prettier",
    description:
      "Flat config with the TanStack Query plugin; Prettier sorts Tailwind classes.",
  },
  {
    title: "Theming",
    description:
      "next-themes writes the class before paint, so there is no flash on load.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16">
      <p className="font-mono text-sm text-muted-foreground">42 · scaffold</p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance">
        {siteConfig.name}
      </h1>
      <p className="mt-3 max-w-xl text-lg text-pretty text-muted-foreground">
        The frontend is wired and ready. Replace this page once the subject is
        settled.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {STACK.map(({ title, description }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
