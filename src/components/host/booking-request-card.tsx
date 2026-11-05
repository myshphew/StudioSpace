"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Booking } from "@/lib/types";
import * as store from "@/lib/demo/store";
import type { DisplayStatus } from "@/lib/demo/store";
import { getStudioById } from "@/lib/demo/store";
import { formatBDT, endLabel, formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * One incoming booking request as seen by the host. Used in both the
 * aggregate request queue and a single studio's bookings page.
 */
export function BookingRequestCard({
  booking,
  showStudio = true,
}: {
  booking: Booking;
  showStudio?: boolean;
}) {
  const studio = getStudioById(booking.studioId);
  const display = store.displayStatus(booking);
  const awaiting = display === "pending";

  const [dialog, setDialog] = useState<null | "accept" | "decline">(null);
  const [busy, setBusy] = useState(false);

  const initials = booking.creatorName
    .split(" ")
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const act = (kind: "accept" | "decline") => {
    setBusy(true);
    const result =
      kind === "accept" ? store.acceptBooking(booking.id) : store.declineBooking(booking.id);
    setBusy(false);
    setDialog(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    if (kind === "accept") {
      toast.success("Booking approved.", {
        description: "The slot is locked and the creator sees it as confirmed.",
      });
    } else {
      toast("Request declined.", {
        description: "The creator can rebook another space or time.",
      });
    }
  };

  return (
    <li className="flex flex-col gap-5 rounded-md border border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-display text-sm font-bold text-brand-canvas">
        {initials || "?"}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-display text-base font-bold tracking-[-0.02em] text-neutral-950">
            {booking.creatorName}
          </p>
          <BookingStatusBadge status={display} />
        </div>
        {booking.creatorEmail ? (
          <p className="text-[13px] text-neutral-600">{booking.creatorEmail}</p>
        ) : null}
        {showStudio && studio ? (
          <p className="text-sm text-neutral-700">
            for{" "}
            <Link
              href={`/studios/${studio.id}`}
              className="font-medium text-neutral-950 underline-offset-4 hover:underline"
            >
              {studio.name}
            </Link>
          </p>
        ) : null}
        <p className="text-sm text-neutral-700">
          {formatShortDate(booking.date)} · {endLabel(booking.start, booking.hours)}
        </p>
        {booking.message ? (
          <blockquote className="max-w-xl rounded-sm bg-neutral-100 px-3.5 py-2.5 text-sm leading-relaxed text-neutral-800">
            “{booking.message}”
          </blockquote>
        ) : null}
        <p className="text-xs text-neutral-500">
          {booking.reference} — session {formatBDT(booking.total)}
          {booking.securityDeposit > 0
            ? ` · deposit ${formatBDT(booking.securityDeposit)} arranged directly`
            : ""}
        </p>
      </div>

      {awaiting ? (
        <div className="flex shrink-0 flex-wrap gap-2.5 sm:flex-col sm:items-end">
          <Button size="sm" onClick={() => setDialog("accept")}>
            Approve
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDialog("decline")}>
            Decline
          </Button>
        </div>
      ) : null}

      <AcceptDialog
        kind={dialog}
        booking={booking}
        display={display}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={act}
      />
    </li>
  );
}

function AcceptDialog({
  kind,
  booking,
  display,
  busy,
  onClose,
  onConfirm,
}: {
  kind: null | "accept" | "decline";
  booking: Booking;
  display: DisplayStatus;
  busy: boolean;
  onClose: () => void;
  onConfirm: (kind: "accept" | "decline") => void;
}) {
  const accept = kind === "accept";
  return (
    <Dialog open={kind !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby="host-action-desc">
        <DialogHeader>
          <DialogTitle>
            {accept ? "Approve this booking?" : "Decline this request?"}
          </DialogTitle>
          <DialogDescription id="host-action-desc">
            {accept
              ? "The slot gets confirmed and locked for this creator. Payment for the session and any deposit is settled directly with them."
              : "The creator sees the request as declined and can look at other spaces or times."}{" "}
            {formatShortDate(booking.date)} · {endLabel(booking.start, booking.hours)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {accept ? "Not now" : "Keep Request"}
          </Button>
          <Button
            variant={accept ? "dark" : "dark"}
            disabled={busy || display !== "pending"}
            onClick={() => onConfirm(kind === "accept" ? "accept" : "decline")}
          >
            {busy ? "Working..." : accept ? "Approve Booking" : "Decline Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
