"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/section";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    copy: "Explore creative spaces that match your vision, location and budget.",
  },
  {
    n: "02",
    title: "Request",
    copy: "Choose your preferred date and send a booking request directly to the host.",
  },
  {
    n: "03",
    title: "Get approved",
    copy: "Your host reviews the request and confirms whether the space is available.",
  },
  {
    n: "04",
    title: "Create",
    copy: "Make the most of your space. It's time to bring your idea to life.",
  },
];

/** Dark editorial how-it-works band for the homepage. */
export function HomeSteps() {
  return (
    <section className="relative">
      <div className="dark-section bg-neutral-950 py-20 text-brand-canvas sm:py-28">
        <div className="container-page">
          <Eyebrow className="!text-neutral-400">Simple by design</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            From idea to creation.
          </h2>
          <p className="mt-4 max-w-lg text-base text-neutral-400">
            Finding a creative space shouldn&rsquo;t get in the way of creating
            something great.
          </p>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-md border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.n} className="flex flex-col gap-6 bg-neutral-950 p-6 sm:p-8">
                <p className="font-display text-6xl font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--color-neutral-700)]">
                  {step.n}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="font-display text-xl font-bold tracking-[-0.025em] text-brand-canvas">
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-400">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex items-center gap-4">
            <Button asChild variant="onDark">
              <Link href="/how-it-works">
                See How It Works
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const stepCopy = STEPS;
