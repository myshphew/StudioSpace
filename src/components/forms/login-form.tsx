"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

/** `?next=` redirect target, constrained to local paths. */
function useSafeNext(): string {
  const params = useSearchParams();
  const next = params.get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/profile";
}

export function LoginForm() {
  const router = useRouter();
  const nextPath = useSafeNext();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) {
      setFormError("Enter your email and password to log in.");
      return;
    }
    setBusy(true);
    const result = store.signIn(email, password);
    if (result.error === "invalid_credentials") {
      setBusy(false);
      setFormError("No account matches those details. Try again or create an account.");
      return;
    }
    if (result.error) {
      setBusy(false);
      setFormError("Something went wrong. Give it another go.");
      return;
    }
    refresh();
    toast.success("Welcome back.", {
      description: "Pick up where you left off.",
    });
    router.replace(nextPath);
  };

  const usingDemo = () => {
    setBusy(true);
    const result = store.signIn(store.DEMO_ACCOUNT.email, store.DEMO_ACCOUNT.password);
    if (result.user) {
      refresh();
      toast("Signed in with the demo account", {
        description: "It arrives pre-filled with sample listings and bookings.",
      });
      router.replace(nextPath);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {formError ? (
        <p className="rounded-sm bg-error-soft px-4 py-3 text-sm text-error" role="alert">
          {formError}
        </p>
      ) : null}

      <Field label="Email address" htmlFor="login-email" required>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.space"
        />
      </Field>

      <Field label="Password" htmlFor="login-password" required>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </Field>

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Logging in..." : "Log In"}
      </Button>

      <div className="flex items-center gap-4 py-1">
        <span className="h-px flex-1 bg-neutral-200" aria-hidden />
        <span className="text-xs text-neutral-500">or</span>
        <span className="h-px flex-1 bg-neutral-200" aria-hidden />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={() =>
          toast("Google sign-in connects once the real backend is live.", {
            description: "For now, use email and password — or the demo account.",
          })
        }
      >
        <GoogleGlyph />
        Continue with Google
      </Button>

      <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-100/70 p-4 text-sm">
        <p className="font-semibold text-neutral-950">Just reviewing the demo?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
          The demo account is pre-filled with listings, bookings in every status
          and incoming requests.
        </p>
        <button
          type="button"
          onClick={usingDemo}
          disabled={busy}
          className="mt-3 font-semibold text-brand-orange underline-offset-4 hover:underline disabled:opacity-50"
        >
          Use the demo account →
        </button>
      </div>
    </form>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81"
      />
    </svg>
  );
}
