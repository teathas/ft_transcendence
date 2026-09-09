"use client";

import { useLogin } from "../hooks/use-auth";
import { loginSchema } from "../schemas";
import { AuthForm, type AuthField } from "./auth-form";

const FIELDS: AuthField[] = [
  { name: "username", label: "Username", autoComplete: "username" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
  },
];

export function LoginForm() {
  const login = useLogin();

  return (
    <AuthForm
      schema={loginSchema}
      fields={FIELDS}
      submitLabel="Sign in"
      isPending={login.isPending}
      error={login.error}
      onSubmit={(values) => login.mutate(values)}
    />
  );
}
