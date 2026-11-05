"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { SEED_STUDIOS } from "@/lib/demo/studios";
import { useAvailabilityFor } from "@/lib/hooks";
import { StudioCard } from "@/components/studio/studio-card";
import { Eyebrow } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

/** HANDPICKED SPACES — seed listings with favorites and availability from the demo store. */
export function FeaturedStudios() {
  const featured = useMemo(() => SEED_STUDIOS.filter((s) => s.featured).slice(0, 4), []);
  const availability = useAvailabilityFor(featured);

  return (
    <section aria-labelledby="featured-heading" className="container-page">
      <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4">
          <Eyebrow>Handpicked spaces</Eyebrow>
          <h2
            id="featured-heading"
            className="max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-5xl"
          >
            Spaces worth discovering.
          </h2>
          <p className="max-w-md text-base text-neutral-700">
            A few inspiring places to get your next project moving.
          </p>
        </div>
        <Button asChild variant="secondary" className="self-start sm:self-auto">
          <Link href="/studios">
            Explore All Studios
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((studio, i) => (
          <Reveal key={studio.id} delay={i * 60}>
            <StudioCard
              studio={studio}
              availability={availability[studio.id] ?? "check"}
              priority={i < 2}
              className="h-full"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
