import { Suspense } from "react";
import { StudiosBrowser } from "@/components/studio/studios-browser";

export const metadata = {
  title: "Explore Studios",
  description:
    "Browse creative spaces for photography, film, music, podcasts and everything in between.",
};

export default function ExploreStudiosPage() {
  return (
    <div className="container-page pt-10 sm:pt-14">
      <header className="flex flex-col gap-5">
        <p className="eyebrow">The studio directory</p>
        <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-neutral-950 sm:text-6xl">
          Find a space to make something.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-700">
          Explore creative spaces for photography, film, music, podcasts and
          everything in between.
        </p>
      </header>

      <Suspense fallback={<BrowseSkeleton />}>
        <StudiosBrowser />
      </Suspense>
    </div>
  );
}

function BrowseSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-14">
      <div className="skeleton h-12 w-full max-w-2xl" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="skeleton aspect-[4/5] w-full" />
        <div className="skeleton aspect-[4/5] w-full" />
        <div className="skeleton aspect-[4/5] w-full" />
      </div>
    </div>
  );
}
