import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/constants";
import type { StudioCategory } from "@/lib/types";
import { IMG } from "@/lib/demo/images";
import { Eyebrow } from "@/components/section";
import { Reveal } from "@/components/reveal";

const CATEGORY_IMAGE: Record<StudioCategory, string> = {
  photography: IMG.photoStudioCyc,
  film: IMG.clapperboard,
  podcast: IMG.sm7bDark,
  music: IMG.musicRoomGuitars,
  art: IMG.painterDesk,
};

const CATEGORY_ALT: Record<StudioCategory, string> = {
  photography: "Photography studio with a white cyclorama wall and lighting rigs",
  film: "Film clapperboard held up on an outdoor set",
  podcast: "Podcast microphone on a boom arm against a dark background",
  music: "Music production room with guitars and a mixing console",
  art: "Artist working at a table with brushes and paints",
};

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="container-page">
      <Reveal className="mb-10 flex flex-col gap-4">
        <Eyebrow>Find your creative space</Eyebrow>
        <h2
          id="categories-heading"
          className="max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-5xl"
        >
          What are you creating?
        </h2>
        <p className="max-w-md text-base text-neutral-700">
          Every idea has its own setting. Find a space that fits yours.
        </p>
      </Reveal>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORY_ORDER.map((category, i) => {
          const meta = CATEGORY_META[category];
          return (
            <Reveal as="li" key={category} delay={i * 50}>
              <Link
                href={`/studios?category=${category}`}
                className="group block h-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 outline-offset-4 transition-shadow duration-300 hover:shadow-card focus-visible:outline-2"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <Image
                    src={CATEGORY_IMAGE[category]}
                    alt={CATEGORY_ALT[category]}
                    fill
                    sizes="(min-width: 1024px) 19vw, (min-width: 640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-neutral-50/90 text-neutral-950 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-4">
                  <p className="font-display text-base font-bold tracking-[-0.025em] text-neutral-950">
                    {meta.label}
                  </p>
                  <p className="text-[13px] leading-snug text-neutral-600">{meta.blurb}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>

      <Link
        href="/studios"
        className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 hover:underline"
      >
        Browse Categories
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
