import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { GuestOnly } from "@/components/gates";

export const metadata = {
  title: "Create an account — StudioSpace",
  description: "One account to book creative spaces and list your own — join StudioSpace.",
};

export default function RegisterPage() {
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
            <p className="eyebrow">Get started</p>
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-neutral-950">
              Create your account.
            </h1>
            <p className="text-base leading-relaxed text-neutral-700">
              One account does both: book spaces for your work and list your own.
            </p>
          </header>
          <div className="mt-10">
            <RegisterForm />
          </div>
          <p className="mt-10 text-sm text-neutral-700">
            Already with us?{" "}
            <Link href="/login" className="font-semibold text-neutral-950 underline underline-offset-4 hover:text-brand-orange">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </GuestOnly>
  );
}
