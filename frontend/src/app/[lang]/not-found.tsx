import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { getDict } from "@/i18n/server";

export default async function NotFound() {
  const d = await getDict();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-bold tracking-tight">
        {d.errors.notFound.title}
      </h1>
      <Link href={routes.home} className={buttonStyles({ variant: "outline" })}>
        {d.errors.notFound.back}
      </Link>
    </main>
  );
}
