"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

const ERRORS: Record<Exclude<store.AuthError, "unknown">, string> = {
  email_taken: "An account with this email already exists. Try logging in instead.",
  weak_password: "Passwords need at least 6 characters — a little more security.",
  invalid_credentials: "No account matches those details. Try again or create an account.",
};

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const fieldErrors: Record<string, string> = {};
    if (!form.name.trim()) fieldErrors.name = "What should we call you?";
    if (!form.email.trim()) fieldErrors.email = "We need an email to reach you.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      fieldErrors.email = "That email doesn't look right yet.";
    if (!form.password) fieldErrors.password = "Choose a password.";
    else if (form.password.length < 6) fieldErrors.password = ERRORS.weak_password;
    setFieldErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setBusy(true);
    const result = store.signUp({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (result.error) {
      setBusy(false);
      setFormFieldErrorForResult(result.error);
      return;
    }
    refresh();
    toast.success("Account created — you're one step closer.", {
      description: "Log in and everything opens up.",
    });
    router.replace("/login");
  };

  const setFormFieldErrorForResult = (error: store.AuthError) => {
    if (error === "email_taken") {
      setFieldErrors({ email: ERRORS.email_taken });
      return;
    }
    if (error === "weak_password") {
      setFieldErrors({ password: ERRORS.weak_password });
      return;
    }
    setFormError("Something went wrong. Give it another go.");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {formError ? (
        <p className="rounded-sm bg-error-soft px-4 py-3 text-sm text-error" role="alert">
          {formError}
        </p>
      ) : null}

      <Field label="Full name" htmlFor="register-name" required error={fieldErrors.name}>
        <Input
          id="register-name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Amara Hossain"
          aria-invalid={Boolean(fieldErrors.name)}
        />
      </Field>

      <Field label="Email address" htmlFor="register-email" required error={fieldErrors.email}>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => patch({ email: e.target.value })}
          placeholder="you@studio.space"
          aria-invalid={Boolean(fieldErrors.email)}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="register-password"
        required
        error={fieldErrors.password}
        hint="At least 6 characters."
      >
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => patch({ password: e.target.value })}
          placeholder="Create a password"
          aria-invalid={Boolean(fieldErrors.password)}
        />
      </Field>

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Creating account..." : "Create Account"}
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
            description: "For now, create your account with email and password.",
          })
        }
      >
        <GoogleGlyph />
        Continue with Google
      </Button>

      <p className="text-xs leading-relaxed text-neutral-600">
        By creating an account you agree to our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-neutral-950">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-neutral-950">
          Privacy Policy
        </a>
        .
      </p>
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
