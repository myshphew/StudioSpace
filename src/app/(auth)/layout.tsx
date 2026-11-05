import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { IMG } from "@/lib/demo/images";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-[5fr_7fr]">
      {/* Brand panel — storytelling side of the page on larger screens */}
      <aside className="dark-section hidden flex-col justify-between bg-neutral-950 p-10 text-brand-canvas lg:flex xl:p-14">
        <Link
          href="/"
          aria-label="StudioSpace — home"
          className="w-fit rounded-xs outline-offset-4 focus-visible:outline-2"
        >
          <Logo dark className="text-3xl" />
        </Link>

        <figure className="flex flex-col gap-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src={IMG.stageMic}
              alt="A microphone on stage, lit warm in a dark room"
              fill
              priority
              sizes="(min-width: 1280px) 40vw, 45vw"
              className="object-cover"
            />
          </div>
          <blockquote className="flex max-w-md flex-col gap-4">
            <p className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-brand-canvas">
              &ldquo;Every idea needs a place to come alive.&rdquo;
            </p>
            <figcaption className="text-sm text-neutral-400">
              Found in every studio we list — and every room waiting to become one.
            </figcaption>
          </blockquote>
        </figure>

        <p className="text-xs leading-relaxed text-neutral-500">
          Demo build — accounts, listings and bookings are fictional sample data
          stored in your own browser.
        </p>
      </aside>

      {/* Form side */}
      <main id="main" className="flex flex-1 flex-col bg-brand-canvas">
        {children}
      </main>
    </div>
  );
}
