import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKING_STATUS_META, LISTING_STATUS_META } from "@/lib/constants";
import type { BookingDisplayStatus, ListingStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function StarRating({
  rating,
  reviewCount,
  className,
  showCount = true,
}: {
  rating: number;
  reviewCount?: number;
  className?: string;
  showCount?: boolean;
}) {
  if (rating <= 0) return null;
  return (
    <p className={cn("flex items-center gap-1 text-sm", className)}>
      <Star className="size-4 fill-brand-sunshine text-brand-sunshine" aria-hidden />
      <span className="font-semibold text-neutral-950">{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined ? (
        <span className="text-neutral-600">({reviewCount} reviews)</span>
      ) : null}
    </p>
  );
}

export function StarRow({ value, className }: { value: number; className?: string }) {
  return (
    <p className={cn("flex items-center gap-0.5", className)} aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i <= value ? "fill-brand-sunshine text-brand-sunshine" : "text-neutral-300",
          )}
          aria-hidden
        />
      ))}
    </p>
  );
}

type MetaTone = "success" | "warning" | "muted" | "error" | "info";
type BadgeTone = "success" | "warning" | "error" | "info" | "neutral" | "orange" | "dark" | "outline";

const TONE_MAP: Record<MetaTone, BadgeTone> = {
  success: "success",
  warning: "warning",
  error: "error",
  muted: "neutral",
  info: "info",
};

/** Booking status badge — never color-only; the label text carries the state. */
export function BookingStatusBadge({ status }: { status: BookingDisplayStatus }) {
  const meta = BOOKING_STATUS_META[status];
  return (
    <Badge tone={TONE_MAP[meta.tone] ?? "neutral"} title={meta.description}>
      {meta.label}
    </Badge>
  );
}

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const meta = LISTING_STATUS_META[status];
  return (
    <Badge tone={TONE_MAP[meta.tone] ?? "neutral"} title={meta.description}>
      {meta.label}
    </Badge>
  );
}
