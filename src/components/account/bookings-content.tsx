"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Booking } from "@/lib/types";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import type { DisplayStatus } from "@/lib/demo/store";
import { SEED_STUDIOS } from "@/lib/demo/studios";
import { useDemoData } from "@/lib/hooks";
import { formatBDT, endLabel, formatShortDate } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { BookingStatusBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StudioImage } from "@/components/studio/studio-image";

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "declined", label: "Declined" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function BookingsContent() {
  const { user, ready } = useSession();
  const data = useDemoData();

  const [tab, setTab] = useState<TabValue>("all");

  if (!user || !ready) return null;

  // Pure derivation from the subscribed snapshot — the same filter + sort
  // the store getter applies, evaluated from data the component owns.
  const bookings = data.bookings
    .filter((b) => b.creatorId === user.id)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const inTab = (b: Booking) => {
    const display = store.displayStatus(b);
    switch (tab) {
      case "all":
        return true;
      case "pending":
        return display === "pending" || display === "expired";
      case "confirmed":
        return display === "confirmed";
      case "completed":
        return display === "completed";
      case "cancelled":
        return display === "cancelled";
      case "declined":
        return display === "declined";
    }
  };

  const visible = bookings.filter(inTab);
  const countFor = (value: TabValue) =>
    bookings.filter((b) => inTabFor(value, b)).length;

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
      <TabsList className="w-full sm:w-auto">
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
            <span className="ml-1.5 text-xs text-neutral-500">{countFor(t.value)}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={tab} forceMount>
        {visible.length === 0 ? (
          <EmptyState
            title="Nothing here just yet."
            description={
              tab === "all"
                ? "Your next creative session starts with a request. Find a space and pick a time."
                : "No bookings in this state right now — that's not a bad thing."
            }
            action={
              tab === "all" ? (
                <Button asChild>
                  <Link href="/studios">Explore Studios</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {visible.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}

function inTabFor(value: TabValue, b: Booking) {
  const display = store.displayStatus(b);
  switch (value) {
    case "all":
      return true;
    case "pending":
      return display === "pending" || display === "expired";
    case "confirmed":
      return display === "confirmed";
    case "completed":
      return display === "completed";
    case "cancelled":
      return display === "cancelled";
    case "declined":
      return display === "declined";
  }
}

function BookingRow({ booking }: { booking: Booking }) {
  const { user } = useSession();
  const data = useDemoData();

  const studio =
    data.listings.find((l) => l.id === booking.studioId) ??
    SEED_STUDIOS.find((s) => s.id === booking.studioId);

  const display = store.displayStatus(booking);
  const cancellable = display === "pending" || display === "confirmed";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const confirmCancel = () => {
    if (!user) return;
    setBusy(true);
    const result = store.cancelBooking(booking.id, user.id);
    setBusy(false);
    setDialogOpen(false);
    if (result.ok) {
      toast.success("Booking cancelled.", {
        description: "The studio is available for that time again.",
      });
    } else {
      toast.error(result.error);
    }
  };

  if (!studio) return null;

  return (
    <li className="flex flex-col gap-5 rounded-md border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <Link
        href={`/studios/${studio.id}`}
        className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-100 sm:aspect-auto sm:size-24 sm:shrink-0"
      >
        <StudioImage
          src={studio.images[0] ?? ""}
          alt={studio.name}
          sizes="120px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/studios/${studio.id}`}
            className="font-display text-lg font-bold tracking-[-0.025em] text-neutral-950 hover:text-brand-orange"
          >
            {studio.name}
          </Link>
          <BookingStatusBadge status={display} />
        </div>
        <p className="text-sm text-neutral-700">
          {formatShortDate(booking.date)} · {endLabel(booking.start, booking.hours)}
        </p>
        {booking.message ? (
          <p className="max-w-xl truncate text-sm text-neutral-600" title={booking.message}>
            “{booking.message}”
          </p>
        ) : null}
        <p className="text-xs text-neutral-500">
          {booking.reference} — session {formatBDT(booking.total)} · deposit{" "}
          {formatBDT(booking.securityDeposit)} paid directly with the host
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:justify-end">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/studios/${studio.id}`}>View Studio</Link>
        </Button>
        {cancellable ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            {display === "pending" ? "Cancel Request" : "Cancel Booking"}
          </Button>
        ) : null}
      </div>

      <CancelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        booking={booking}
        display={display}
        busy={busy}
        onConfirm={confirmCancel}
      />
    </li>
  );
}

function CancelDialog({
  open,
  onOpenChange,
  booking,
  display,
  busy,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  display: DisplayStatus;
  busy: boolean;
  onConfirm: () => void;
}) {
  const pending = display === "pending";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="cancel-dialog-desc">
        <DialogHeader>
          <DialogTitle>
            {pending ? "Withdraw this request?" : "Cancel this booking?"}
          </DialogTitle>
          <DialogDescription id="cancel-dialog-desc">
            {pending
              ? "Your request hasn't been approved yet — cancelling simply withdraws it. No payment is involved."
              : "The slot will open up for other requests. Let the host know as soon as you can — the studio's cancellation policy applies."}{" "}
            {formatShortDate(booking.date)} at {booking.start}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Keep Booking
          </Button>
          <Button variant="dark" onClick={onConfirm} disabled={busy}>
            {busy ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
