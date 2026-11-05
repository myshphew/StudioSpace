"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const SUBJECTS = [
  { value: "booking", label: "Booking a space" },
  { value: "hosting", label: "Listing my studio" },
  { value: "partnership", label: "Partnerships & press" },
  { value: "feedback", label: "Feedback on StudioSpace" },
  { value: "other", label: "Something else" },
] as const;

export function ContactForm() {
  const { user, ready } = useSession();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "booking",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "error" | "sent">("idle");

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));
  const name = form.name || (ready && user ? user.name : "");
  const email = form.email || (ready && user ? user.email : "");

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Add your name so we know who to reply to.";
    if (!email.trim()) next.email = "We need your email to reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That email doesn't look right yet.";
    if (!form.subject) next.subject = "Pick a subject so it reaches the right desk.";
    if (form.message.trim().length < 10)
      next.message = "A few more words helps us help you — tell us what you need.";
    return next;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setState("error");
      return;
    }
    setState("sending");
    // Demo seam: the backend endpoint will take this exact payload.
    setTimeout(() => setState("sent"), 700);
  };

  if (state === "sent") {
    return (
      <div
        className="flex flex-col items-start gap-5 rounded-lg border border-neutral-200 bg-neutral-50 p-8 sm:p-10"
        aria-live="polite"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-6 text-success" aria-hidden />
        </span>
        <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-neutral-950">
          Message sent.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-neutral-700">
          Thanks for writing in. We&rsquo;ll get back to you within 2 working
          days — usually sooner.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/studios">Explore Studios</Link>
          </Button>
          <Button variant="ghost" onClick={() => setState("idle")}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {state === "error" && Object.keys(errors).length > 0 ? (
        <p
          className="rounded-sm bg-error-soft px-4 py-3 text-sm leading-relaxed text-error"
          role="alert"
        >
          Message didn&rsquo;t send. Check the highlighted fields and try again.
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="contact-name" required error={errors.name}>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Amara Hossain"
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label="Email address" htmlFor="contact-email" required error={errors.email}>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder="you@studio.space"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
      </div>

      <Field label="Subject" htmlFor="contact-subject" required error={errors.subject}>
        <Select value={form.subject} onValueChange={(v) => patch({ subject: v })}>
          <SelectTrigger id="contact-subject" aria-label="Message subject">
            {SUBJECTS.find((s) => s.value === form.subject)?.label}
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Message" htmlFor="contact-message" required error={errors.message}>
        <Textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => patch({ message: e.target.value })}
          placeholder="Tell us what's on your mind..."
          className="min-h-36"
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-500">We reply within 2 working days.</p>
        <Button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
