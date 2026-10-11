import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.auth.login.metaTitle,
    description: d.auth.login.metaDescription,
  };
}

export default async function LoginPage() {
  const d = await getDict();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {d.auth.login.title}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          {d.auth.login.subtitle}
        </p>
      </header>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        {d.auth.login.noAccount}{" "}
        <Link
          href={routes.register}
          className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          {d.auth.login.createAccount}
        </Link>
      </p>
    </div>
  );
}
