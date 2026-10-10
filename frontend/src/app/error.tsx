"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Something broke</h1>
      <p className="max-w-md text-pretty text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
