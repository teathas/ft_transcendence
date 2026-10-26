"use client";

import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { isApiError } from "@/lib/api";

import { useLogout, useSession, useUpdateProfile } from "../hooks/use-auth";

/**
 * Nothing in the app opens until the signed-in user has accepted the terms:
 * accounts that predate them land here too. There is no way past it but to
 * accept, or to sign out.
 */
export function TermsGate({ children }: { children: React.ReactNode }) {
  const d = useDict();
  const { user, isPending } = useSession();
  const accept = useUpdateProfile();
  const logout = useLogout();

  // Not shown the app for a moment while we find out whether they accepted.
  if (isPending && !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <LoaderCircle
          className="size-6 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  // `user` is missing only when the session could not be read (offline, or a
  // 401 that is already sending them to the login): that is not ours to block.
  if (!user || user.termsAccepted) return children;

  const link = "font-medium text-primary underline-offset-4 hover:underline";

  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center p-4">
      <section
        aria-labelledby="terms-gate-title"
        className="flex w-full max-w-md flex-col gap-5 rounded-xl border bg-card p-6 shadow-lg shadow-black/5"
      >
        <div className="flex flex-col gap-2">
          <h1 id="terms-gate-title" className="text-xl font-semibold">
            {d.auth.termsGate.title}
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            {d.auth.termsGate.description}
          </p>
        </div>

        <p className="text-sm">
          <Link href={routes.terms} target="_blank" className={link}>
            {d.auth.register.termsLink}
          </Link>
          {" · "}
          <Link href={routes.privacy} target="_blank" className={link}>
            {d.auth.register.privacyLink}
          </Link>
        </p>

        {accept.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {isApiError(accept.error)
                ? accept.error.message
                : d.common.tryAgain}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => logout.mutate()}
            disabled={accept.isPending || logout.isPending}
          >
            {d.nav.signOut}
          </Button>
          <Button
            onClick={() => accept.mutate({ termsAccepted: true })}
            disabled={accept.isPending}
          >
            {accept.isPending && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {d.auth.termsGate.accept}
          </Button>
        </div>
      </section>
    </main>
  );
}
