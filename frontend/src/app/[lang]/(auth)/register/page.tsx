import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.auth.register.metaTitle,
    description: d.auth.register.metaDescription,
  };
}

export default async function RegisterPage() {
  const d = await getDict();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {d.auth.register.title}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          {d.auth.register.subtitle}
        </p>
      </header>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        {d.auth.register.haveAccount}{" "}
        <Link
          href={routes.login}
          className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          {d.auth.register.signIn}
        </Link>
      </p>
    </div>
  );
}
