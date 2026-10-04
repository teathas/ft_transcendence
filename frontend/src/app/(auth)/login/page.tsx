import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to rejoin your rooms.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-pretty text-muted-foreground">
          Sign in to rejoin your rooms and pick up where you left off.
        </p>
      </header>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        New to Shared Room?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
