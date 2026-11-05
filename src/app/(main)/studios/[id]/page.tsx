import { Suspense } from "react";
import { SEED_STUDIOS } from "@/lib/demo/studios";
import { StudioDetailContent } from "@/components/studio/studio-detail-content";
import { StoreStudioDetail } from "@/components/studio/store-studio-detail";

const fallbackTitle = "Studio details — StudioSpace";

export async function generateMetadata({ params }: Pick<PageProps<"/studios/[id]">, "params">) {
  const { id } = await params;
  const seed = SEED_STUDIOS.find((s) => s.id === id);
  if (!seed) return { title: fallbackTitle };
  return {
    title: `${seed.name} — StudioSpace`,
    description: seed.tagline,
  };
}

export function generateStaticParams() {
  return SEED_STUDIOS.map((s) => ({ id: s.id }));
}

export default function StudioPage({ params }: PageProps<"/studios/[id]">) {
  return (
    <Suspense fallback={<StudioDetailSkeleton />}>
      <StudioDetail params={params} />
    </Suspense>
  );
}

async function StudioDetail({ params }: Pick<PageProps<"/studios/[id]">, "params">) {
  const { id } = await params;

  // Curated demo spaces prerender as static content…
  const seed = SEED_STUDIOS.find((s) => s.id === id);
  if (seed) return <StudioDetailContent studio={seed} />;

  // …while user-created listings resolve from the demo store on the client.
  return <StoreStudioDetail id={id} />;
}

function StudioDetailSkeleton() {
  return (
    <div className="container-page pt-6 pb-24">
      <div className="skeleton h-4 w-64" />
      <div className="mt-8 flex flex-col gap-4">
        <div className="skeleton h-12 w-full max-w-2xl" />
        <div className="skeleton h-4 w-56" />
      </div>
      <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="skeleton aspect-[4/3]" />
        <div className="grid grid-rows-2 gap-2">
          <div className="skeleton aspect-[4/3]" />
          <div className="skeleton aspect-[4/3]" />
        </div>
        <div className="skeleton aspect-[4/3]" />
        <div className="skeleton aspect-[4/3]" />
      </div>
      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="flex flex-col gap-8">
          <div className="skeleton h-8 w-72" />
          <div className="skeleton h-24 w-full max-w-2xl" />
          <div className="skeleton h-40 w-full max-w-2xl" />
          <div className="skeleton h-40 w-full max-w-2xl" />
        </div>
        <div className="skeleton h-[480px] w-full rounded-md" />
      </div>
    </div>
  );
}
