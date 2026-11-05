"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth/session";
import { SEED_STUDIOS } from "@/lib/demo/studios";
import { useDemoData, useAvailabilityFor } from "@/lib/hooks";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { StudioCard } from "@/components/studio/studio-card";

export function FavoritesGrid() {
  const { user, ready } = useSession();
  const data = useDemoData();

  // Pure derivation: seed studios + own listings, filtered by the
  // subscribed favorites map. Computed before the gate below so the
  // availability hook stays unconditionally called.
  const favoriteIds = new Set(user ? (data.favorites[user.id] ?? []) : []);
  const favorites = [...SEED_STUDIOS, ...data.listings].filter((s) =>
    favoriteIds.has(s.id),
  );

  const availability = useAvailabilityFor(favorites);

  if (!user || !ready) return null;

  if (!user || !ready) return null;

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet."
        description="Tap the heart on any studio and it lands here — handy when you're weighing three options at midnight."
        action={
          <Button asChild>
            <Link href="/studios">Explore Studios</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-neutral-600" aria-live="polite">
        {favorites.length} {favorites.length === 1 ? "space" : "spaces"} saved
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map((studio, i) => (
          <StudioCard
            key={studio.id}
            studio={studio}
            availability={availability[studio.id] ?? "check"}
            priority={i < 3}
          />
        ))}
      </div>
    </div>
  );
}
