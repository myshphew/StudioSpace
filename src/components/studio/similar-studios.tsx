"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Studio } from "@/lib/types";
import { SEED_STUDIOS } from "@/lib/demo/studios";
import { useAvailabilityFor } from "@/lib/hooks";
import { StudioCard } from "@/components/studio/studio-card";
import { Reveal } from "@/components/reveal";

function similarTo(studio: Studio): Studio[] {
  const sameCategory = SEED_STUDIOS.filter(
    (s) => s.category === studio.category && s.id !== studio.id && s.status === "active",
  );
  if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
  const others = SEED_STUDIOS.filter(
    (s) => s.category !== studio.category && s.status === "active" && s.id !== studio.id,
  );
  return [...sameCategory, ...others].slice(0, 3);
}

export function SimilarStudios({ studio }: { studio: Studio }) {
  const similar = useMemo(() => similarTo(studio), [studio]);
  const availability = useAvailabilityFor(similar);

  return (
    <section aria-labelledby="similar-heading" className="container-page">
      <Reveal className="mb-8 flex flex-col gap-3">
        <h2
          id="similar-heading"
          className="font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-neutral-950 sm:text-4xl"
        >
          A few more spaces to explore.
        </h2>
        <p className="max-w-md text-neutral-700">
          If this space caught your eye, these might too.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {similar.map((s, i) => (
          <Reveal key={s.id} delay={i * 60}>
            <StudioCard studio={s} availability={availability[s.id] ?? "check"} />
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          href="/studios"
          className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 hover:underline"
        >
          Explore More Studios
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
