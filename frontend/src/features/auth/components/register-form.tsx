"use client";

import { useRegister } from "../hooks/use-auth";
import { registerSchema } from "../schemas";
import { AuthForm, type AuthField } from "./auth-form";

const FIELDS: AuthField[] = [
  { name: "username", label: "Username", autoComplete: "username" },
  { name: "displayName", label: "Display name", autoComplete: "nickname" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
  },
];

export function RegisterForm() {
  const register = useRegister();

  return (
    <AuthForm
      schema={registerSchema}
      fields={FIELDS}
      submitLabel="Create account"
      isPending={register.isPending}
      error={register.error}
      onSubmit={(values) => register.mutate(values)}
    />
  );
}
