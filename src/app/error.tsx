"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Real deployments log to the observability stack; the demo logs plainly.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-dvh flex-col items-center justify-center text-center">
      <Logo className="text-4xl sm:text-5xl" />
      <p className="eyebrow mt-12 text-error">Something went wrong</p>
      <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-neutral-950 sm:text-6xl">
        Let&rsquo;s try that again.
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-700">
        An unexpected error interrupted the page. Retrying usually does the
        trick — your listing and session data stay right where they are.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="secondary">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
