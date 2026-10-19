"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { reportError } from "@/lib/monitoring";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportError(error, { boundary: "app", digest: error.digest });
  }, [error]);

  return (
    <div role="alert">
      <h1>Something went wrong</h1>
      <p>We&apos;ve logged the problem. Try again, and if it keeps happening, contact support.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
