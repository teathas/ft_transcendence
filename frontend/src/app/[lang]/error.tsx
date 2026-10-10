"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const d = useDict();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        {d.errors.crash.title}
      </h1>
      <p className="max-w-md text-pretty text-muted-foreground">
        {error.message || d.errors.crash.body}
      </p>
      <Button onClick={reset}>{d.common.tryAgain}</Button>
    </main>
  );
}
