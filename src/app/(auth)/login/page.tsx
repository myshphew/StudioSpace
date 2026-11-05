import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { GuestOnly } from "@/components/gates";

export const metadata = {
  title: "Log in — StudioSpace",
  description: "Log in to book creative spaces, manage your listings and reply to requests.",
};

export default function LoginPage() {
  return (
    <GuestOnly>
      <div className="container-page flex flex-1 flex-col py-10 sm:py-14">
        <Link
          href="/"
          className="w-fit text-sm text-neutral-600 underline-offset-4 hover:text-neutral-950 hover:underline"
        >
          ← Back home
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-14">
          <header className="flex flex-col gap-4">
            <p className="eyebrow">Welcome back</p>
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-neutral-950">
              Log in.
            </h1>
            <p className="text-base leading-relaxed text-neutral-700">
              Your next session, your listings and your requests are waiting.
            </p>
          </header>
          <div className="mt-10">
            <Suspense fallback={<FormSkeleton />}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-10 text-sm text-neutral-700">
            New here?{" "}
            <Link href="/register" className="font-semibold text-neutral-950 underline underline-offset-4 hover:text-brand-orange">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </GuestOnly>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-12 w-full" />
      <div className="skeleton h-12 w-full" />
      <div className="skeleton h-12 w-full" />
    </div>
  );
}
