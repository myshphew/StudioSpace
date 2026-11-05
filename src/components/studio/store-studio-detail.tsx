"use client";

import Link from "next/link";
import type { Studio } from "@/lib/types";
import { SEED_STUDIOS } from "@/lib/demo/studios";
import { useDemoData } from "@/lib/hooks";
import { StudioDetailContent } from "@/components/studio/studio-detail-content";
import { Logo } from "@/components/logo";

/**
 * Detail view for listings that live in the demo store (user-created during
 * the session). Seed spaces resolve statically — see the [id] page — so this
 * only ever renders once React has had a chance to hydrate the store.
 */
export function StoreStudioDetail({ id }: { id: string }) {
  const data = useDemoData();

  const owned = data.listings.find((l) => l.id === id);
  const studio: Studio | null = owned
    ? toPublic(owned)
    : SEED_STUDIOS.find((s) => s.id === id) ?? null;

  if (!studio) return <NotFoundPanel />;

  return <StudioDetailContent studio={studio} />;
}

/** Strip the owner field so the shared detail tree gets a plain Studio. */
function toPublic(owned: Studio & { ownerId: string }): Studio {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ownerId: _o, ...studio } = owned;
  return studio;
}

function NotFoundPanel() {
  return (
    <div className="container-page flex flex-col items-center pt-24 pb-32 text-center">
      <Logo className="text-4xl sm:text-5xl" />
      <p className="eyebrow mt-10">Lost your way?</p>
      <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-neutral-950 sm:text-6xl">
        This space doesn&rsquo;t exist.
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-neutral-700">
        The studio you&rsquo;re looking for may have been unpublished or the
        link changed. Let&rsquo;s get you back to exploring.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-sm bg-brand-orange px-6 text-sm font-semibold text-brand-charcoal transition-colors hover:bg-[#f25d27] active:bg-[#e65521]"
        >
          Back to Home
        </Link>
        <Link
          href="/studios"
          className="inline-flex h-12 items-center justify-center rounded-sm border border-neutral-300 px-6 text-sm font-semibold text-neutral-950 transition-colors hover:border-neutral-400 hover:bg-neutral-100"
        >
          Explore all studios
        </Link>
      </div>
    </div>
  );
}
