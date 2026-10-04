import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Sign up to get started.",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          Sign up to get started.
        </p>
      </header>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
