import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Studio } from "@/lib/types";
import { CATEGORY_META } from "@/lib/constants";
import { formatBDT } from "@/lib/format";
import { StarRating } from "@/components/status";
import { FavoriteButton } from "@/components/studio/favorite-button";

function availabilityCopy(label: "available" | "limited" | "check") {
  switch (label) {
    case "available":
      return "Available";
    case "limited":
      return "Limited availability";
    case "check":
      return "Check availability";
  }
}

function availabilityClass(label: "available" | "limited" | "check") {
  switch (label) {
    case "available":
      return "text-success";
    case "limited":
      return "text-warning";
    case "check":
      return "text-neutral-600";
  }
}

export function StudioCard({
  studio,
  availability = "check",
  priority = false,
  showAvailability = true,
  className,
}: {
  studio: Studio;
  availability?: "available" | "limited" | "check";
  priority?: boolean;
  showAvailability?: boolean;
  className?: string;
}) {
  const meta = CATEGORY_META[studio.category];
  const isPubliclyVisible = studio.status === "active";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 transition-shadow duration-300 hover:shadow-card",
        !isPubliclyVisible && "opacity-95",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Image
          src={studio.images[0] ?? ""}
          alt={`${studio.name} — ${meta.label.toLowerCase()} in ${studio.area}, ${studio.city}`}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-xs bg-neutral-50/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-800 backdrop-blur">
            {meta.label}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <FavoriteButton
            studioId={studio.id}
            studioName={studio.name}
            size="sm"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-snug tracking-[-0.025em] text-neutral-950">
            <Link
              href={`/studios/${studio.id}`}
              className="outline-offset-4 rounded-xs focus-visible:outline-2 before:absolute before:inset-0"
            >
              {studio.name}
            </Link>
          </h3>
          <StarRating rating={studio.rating} showCount={false} className="mt-0.5 shrink-0" />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-neutral-600">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {studio.area}, {studio.city}
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-sm text-neutral-950">
            <span className="font-display text-base font-bold">{formatBDT(studio.hourlyRate)}</span>
            <span className="text-neutral-600"> / hour</span>
          </p>
          {showAvailability ? (
            <p className={cn("text-xs font-semibold", availabilityClass(availability))}>
              {availabilityCopy(availability)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
