"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  studioId,
  studioName,
  className,
  size = "md",
}: {
  studioId: string;
  studioName: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const { user, ready } = useSession();
  const router = useRouter();
  const [optimistic, setOptimistic] = useState<"added" | "removed" | null>(null);
  const mine = user ? store.isFavorite(studioId, user.id) : false;
  const active = (optimistic ?? (mine ? "added" : "removed")) === "added";

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ready) return;
    if (!user) {
      toast("Log in to save this studio", {
        description: "Favorites are tied to your StudioSpace account.",
      });
      router.push("/login?next=/studios");
      return;
    }
    const next = store.toggleFavorite(studioId, user.id);
    setOptimistic(next);
    // settle after the store emits
    setTimeout(() => setOptimistic(null), 250);
    toast(next === "added" ? "Added to favorites." : "Removed from favorites.");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? `Remove ${studioName} from favorites` : `Save ${studioName}`}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50/90 backdrop-blur transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950",
        size === "md" ? "size-10" : "size-9",
        className,
      )}
    >
      <Heart
        className={cn(
          size === "md" ? "size-[18px]" : "size-4",
          "transition-colors",
          active ? "fill-error text-error" : "text-neutral-800",
        )}
        aria-hidden
      />
    </button>
  );
}
