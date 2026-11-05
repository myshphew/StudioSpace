"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Clock8, Hourglass, Info } from "lucide-react";
import type { Studio, Booking } from "@/lib/types";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { useDemoData, useMounted } from "@/lib/hooks";
import { getSlotsForDate, hoursForDate, nextOpenDay } from "@/lib/schedule";
import { addHours, formatBDT, formatShortDate, formatTime } from "@/lib/format";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Stage = { kind: "idle" } | { kind: "success"; booking: Booking };

export function BookingPanel({
  studio,
  weeklyHours,
  unavailableDates,
}: {
  studio: Studio;
  weeklyHours: React.ReactNode;
  unavailableDates: string[];
}) {
  const { user, ready } = useSession();
  const router = useRouter();
  const data = useDemoData();
  const mounted = useMounted();
  const [date, setDate] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [hours, setHours] = useState<number>(Math.max(1, studio.minHours));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<Stage>({ kind: "idle" });

  // Everything below is derived — no setState-in-effect loops. The calendar
  // preselects the next open day once the client is mounted (demo aside).
  const selectedDate = mounted && !date ? (nextOpenDay(studio) ?? null) : date;

  const durationOptions = useMemo(() => {
    if (!selectedDate || !start) return [];
    const open = hoursForDate(studio, selectedDate);
    if (!open) return [];
    const closeMin = Number(open.close.slice(0, 2)) * 60 + Number(open.close.slice(3));
    const startMin = Number(start.slice(0, 2)) * 60 + Number(start.slice(3));
    const room = Math.floor((closeMin - startMin) / 60);
    const options: number[] = [];
    for (let h = Math.max(1, studio.minHours); h <= room && h <= studio.maxHours; h++) {
      options.push(h);
    }
    return options;
  }, [studio, selectedDate, start]);

  // A stale choice (slot changed beneath it) yields the longest fit instead.
  const selectedHours =
    durationOptions.length > 0 && !durationOptions.includes(hours)
      ? durationOptions[durationOptions.length - 1]
      : hours;

  const slots = useMemo(
    () =>
      selectedDate
        ? getSlotsForDate(studio, selectedDate, selectedHours, data.bookings)
        : [],
    [selectedDate, selectedHours, studio, data.bookings],
  );

  const availableSlots = slots.filter((s) => s.available);
  // Vanish the start time when its slot disappears (booked elsewhere since).
  const selectedStart =
    start !== null && availableSlots.some((s) => s.start === start) ? start : null;

  const subtotal = (selectedStart ? selectedHours : 0) * studio.hourlyRate;
  const total = subtotal;

  if (stage.kind === "success") {
    const b = stage.booking;
    return (
      <aside
        className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 shadow-card"
        aria-live="polite"
      >
        <p className="eyebrow !text-success-soft bg-success-soft !text-success rounded-xs px-2 py-1 w-fit">
          Request sent
        </p>
        <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-neutral-950">
          Your creative plans are in motion.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          Your request has been sent to {studio.host.name}. You&rsquo;ll see an
          update here once the host responds.
        </p>
        <dl className="mt-5 flex flex-col gap-3 border-t border-neutral-200 pt-5 text-sm">
          <Row label="Status">
            <span className="rounded-xs bg-warning-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-warning">
              Pending host approval
            </span>
          </Row>
          <Row label="Studio">{studio.name}</Row>
          <Row label="Date">{formatShortDate(b.date)}</Row>
          <Row label="Time">{endLabel(b.start, b.hours)}</Row>
          <Row label="Estimated total">{formatBDT(b.total)}</Row>
        </dl>
        <div className="mt-6 flex flex-col gap-2.5">
          <Button asChild className="w-full">
            <Link href="/my-bookings">View My Bookings</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/studios/${studio.id}`}>Back to Studio</Link>
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-neutral-500">
          Reference {b.reference}
        </p>
      </aside>
    );
  }

  return (
    <>
      <aside className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6 shadow-card sm:p-7">
        <div className="flex flex-col gap-1">
          <p className="font-display text-xl font-bold tracking-[-0.025em] text-neutral-950">
            {formatBDT(studio.hourlyRate)}{" "}
            <span className="text-sm font-medium text-neutral-600">/ hour</span>
          </p>
          {studio.securityDeposit > 0 ? (
            <p className="text-xs text-neutral-600">
              Plus a {formatBDT(studio.securityDeposit)} security deposit
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              <CalendarDays className="size-3.5" aria-hidden />
              Select date
            </p>
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
              <MonthCalendar
                studio={studio}
                bookings={data.bookings}
                selected={selectedDate}
                onSelect={(iso) => setDate(iso)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              <Clock8 className="size-3.5" aria-hidden />
              Start time
            </p>
            {!selectedDate ? (
              <p className="text-sm text-neutral-500">Pick a date to see open time slots.</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-neutral-700">
                No open slots on this date. Try another day.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Available time slots">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={!slot.available}
                    aria-pressed={selectedStart === slot.start}
                    onClick={() => setStart(slot.start)}
                    className={cn(
                      "h-10 rounded-sm border text-sm transition-colors",
                      selectedStart === slot.start
                        ? "border-neutral-950 bg-neutral-950 font-semibold text-brand-canvas"
                        : "border-neutral-300 bg-transparent text-neutral-950 hover:border-neutral-500",
                      !slot.available &&
                        "cursor-not-allowed border-dashed border-neutral-200 bg-transparent text-neutral-400 line-through",
                    )}
                    aria-label={
                      slot.available
                        ? `${formatTime(slot.start)} — available`
                        : `${formatTime(slot.start)} — booked`
                    }
                  >
                    {formatTime(slot.start)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              <Hourglass className="size-3.5" aria-hidden />
              Duration
            </p>
            {selectedStart && durationOptions.length > 0 ? (
              <Select
                value={String(selectedHours)}
                onValueChange={(v) => setHours(Number(v))}
              >
                <SelectTrigger aria-label="Booking duration">
                  {selectedHours} {selectedHours === 1 ? "hour" : "hours"}
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h} {h === 1 ? "hour" : "hours"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-neutral-500">
                {studio.minHours}-hour minimum — choose a slot first.
              </p>
            )}
          </div>
        </div>

        <dl className="flex flex-col gap-3 border-y border-neutral-200 py-4 text-sm">
          <Row label={`${selectedHours} ${selectedHours === 1 ? "hour" : "hours"} × ${formatBDT(studio.hourlyRate)}`}>
            {formatBDT(selectedStart ? subtotal : studio.minHours * studio.hourlyRate)}
          </Row>
          <Row label="Security deposit">
            <span className="text-neutral-600">{formatBDT(studio.securityDeposit)}</span>
          </Row>
          <div className="flex items-center justify-between pt-1">
            <dt className="font-display text-base font-bold text-neutral-950">Estimated total</dt>
            <dd className="font-display text-lg font-bold text-neutral-950">
              {selectedStart ? formatBDT(total) : formatBDT(studio.minHours * studio.hourlyRate)}
            </dd>
          </div>
        </dl>

        <div className="overflow-hidden rounded-md">
          <dl className="text-xs leading-relaxed text-neutral-600">{weeklyHours}</dl>
          {unavailableDates.length > 0 ? (
            <p className="mt-2 text-xs text-neutral-600">
              Closed on {unavailableDates.slice(0, 3).map(dateLabel).join(", ")}
              {unavailableDates.length > 3 ? " and other dates." : "."}
            </p>
          ) : null}
        </div>

        <Button
          size="lg"
          disabled={!selectedDate || !selectedStart}
          onClick={() => {
            if (!ready || !user) {
              toast("Log in to request this booking", {
                description: "Booking requests are tied to your StudioSpace account.",
              });
              router.push(`/login?next=/studios/${studio.id}`);
              return;
            }
            if (store.isOwnedBy(studio.id, user.id)) {
              toast.error("You can't book your own studio.");
              return;
            }
            setDialogOpen(true);
          }}
        >
          Request to Book
        </Button>

        <div className="flex items-start gap-2 rounded-sm bg-warning-soft p-3 text-xs leading-relaxed text-neutral-800">
          <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          <p>
            Your booking is a request, not a confirmed reservation. The host must
            approve it before your time is secured.
          </p>
        </div>
        <p className="text-xs leading-relaxed text-neutral-600">
          No online payment required at this stage. Payment arrangements are
          made directly with the host.
        </p>
      </aside>

      <RequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        studio={studio}
        date={selectedDate}
        start={selectedStart}
        hours={selectedHours}
        message={message}
        onMessageChange={setMessage}
        onSubmit={() => {
          if (!user || !selectedDate || !selectedStart) return;
          const input = {
            studioId: studio.id,
            date: selectedDate,
            start: selectedStart,
            hours: selectedHours,
            message: message.trim() || undefined,
          };
          const result = store.createBooking(input, user);
          if (result.ok) {
            setDialogOpen(false);
            setStage({ kind: "success", booking: result.booking });
            setMessage("");
            toast.success("Booking request sent.", {
              description: `${studio.host.name} will review your preferred time.`,
            });
          } else {
            toast.error(result.error);
          }
        }}
      />
    </>
  );
}

function endLabel(start: string, hours: number) {
  return `${formatTime(start)} – ${formatTime(addHours(start, hours))}`;
}

function dateLabel(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-neutral-600">{label}</dt>
      <dd className="text-right font-medium text-neutral-950">{children}</dd>
    </div>
  );
}

function RequestDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio: Studio;
  date: string | null;
  start: string | null;
  hours: number;
  message: string;
  onMessageChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent aria-describedby="request-dialog-desc">
        <DialogHeader>
          <DialogTitle>Almost time to create.</DialogTitle>
          <DialogDescription id="request-dialog-desc">
            Send your request to {props.studio.host.name}. The host will review
            your preferred time and respond to your booking request.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-2 gap-2 rounded-sm border border-neutral-200 bg-neutral-100 p-3 text-sm" aria-live="polite">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.08em] text-neutral-500">Date</dt>
            <dd className="font-medium text-neutral-950">
              {props.date ? formatShortDate(props.date) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.08em] text-neutral-500">Time</dt>
            <dd className="font-medium text-neutral-950">
              {props.date && props.start ? `${formatTime(props.start)} – ${formatTime(addHours(props.start, props.hours))}` : "—"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2">
          <label htmlFor="message-to-host" className="text-[13px] font-medium text-neutral-800">
            Message to host
          </label>
          <Textarea
            id="message-to-host"
            value={props.message}
            onChange={(e) => props.onMessageChange(e.target.value)}
            placeholder="Tell the host a little about your project or any special requirements..."
            className="min-h-24"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => props.onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={props.onSubmit}>Send Booking Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
