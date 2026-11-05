import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="dark-section flex min-h-dvh flex-col items-center justify-center bg-neutral-950 px-6 text-center text-brand-canvas">
      <Logo dark className="text-4xl sm:text-5xl" />
      <p className="eyebrow mt-12 !text-neutral-400">Lost your way?</p>
      <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em] sm:text-7xl">
        Page not found.
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-400">
        The page you&rsquo;re after moved, vanished, or never existed. The
        studios, however, are all still here.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-sm bg-brand-orange px-6 text-sm font-semibold text-brand-charcoal transition-colors hover:bg-[#f25d27]"
        >
          Back to Home
        </Link>
        <Link
          href="/studios"
          className="inline-flex h-12 items-center justify-center rounded-sm border border-neutral-700 px-6 text-sm font-semibold text-neutral-100 transition-colors hover:border-neutral-100 hover:bg-neutral-100/10"
        >
          Explore Studios
        </Link>
      </div>
    </div>
  );
}
