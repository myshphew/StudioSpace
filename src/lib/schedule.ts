import type { Studio, WeeklyHours } from "@/lib/types";
import {
  addDaysISO,
  minutesOf,
  todayISO,
  weekdayOf,
} from "@/lib/format";

export interface TimeSlot {
  start: string; // "14:00"
  minutes: number; // minutes from midnight
  available: boolean;
}

const covers = (startMin: number, endMin: number, otherStart: number, otherEnd: number) =>
  startMin < otherEnd && endMin > otherStart;

const EMPTY: Array<{ date: string; start: string; hours: number; studioId: string; status: string }> = [];

/** Opening window for a studio on a specific ISO date, or null when closed. */
export function hoursForDate(studio: Studio, iso: string) {
  if (studio.unavailableDates.includes(iso)) return null;
  return studio.weeklyHours[weekdayOf(iso)] ?? null;
}

function busyFor(
  bookings: Array<{ date: string; start: string; hours: number; studioId: string; status: string }>,
  studioId: string,
  iso: string,
) {
  return bookings
    .filter(
      (b) =>
        b.studioId === studioId &&
        b.date === iso &&
        (b.status === "pending" || b.status === "confirmed"),
    )
    .map((b) => ({ start: minutesOf(b.start), end: minutesOf(b.start) + b.hours * 60 }));
}

function clampHours(studio: Studio, desired: number) {
  if (desired < studio.minHours) return studio.minHours;
  return Math.min(desired, studio.maxHours, 12);
}

/**
 * Bookable hourly start times for a date, given weekly hours, the desired
 * duration, unavailable dates and recorded bookings.
 */
export function getSlotsForDate(
  studio: Studio,
  iso: string,
  hours: number | undefined,
  bookings: Array<{ date: string; start: string; hours: number; studioId: string; status: string }> = EMPTY,
): TimeSlot[] {
  const open = hoursForDate(studio, iso);
  if (!open) return [];
  const openMin = minutesOf(open.open);
  const closeMin = minutesOf(open.close);
  const busy = busyFor(bookings, studio.id, iso);
  const need = clampHours(studio, hours ?? studio.minHours);

  const slotList: TimeSlot[] = [];
  for (let t = openMin; t < closeMin; t += 60) {
    const end = t + need * 60;
    if (end > closeMin) {
      slotList.push({ start: minutesToLabel(t), minutes: t, available: false });
      continue;
    }
    const clash = busy.some((b) => covers(t, end, b.start, b.end));
    slotList.push({ start: minutesToLabel(t), minutes: t, available: !clash });
  }
  return slotList;
}

export function minutesToLabel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Within the advance booking window, not in the past. */
export function isWithinWindow(studio: Studio, iso: string) {
  const today = todayISO();
  if (iso < today) return false;
  return iso <= addDaysISO(today, studio.advanceWindowDays);
}

/** Days from today until (and including) the last bookable date. */
export function windowLength(studio: Studio) {
  return Math.max(1, studio.advanceWindowDays);
}

/** True when a booking of `hours` starting at `start` overlaps recorded bookings. */
export function hasOverlap(
  studio: Studio,
  iso: string,
  start: string,
  hours: number,
  bookings: Array<{ date: string; start: string; hours: number; studioId: string; status: string }>,
) {
  const startMin = minutesOf(start);
  const endMin = startMin + hours * 60;
  return busyFor(bookings, studio.id, iso).some((b) =>
    covers(startMin, endMin, b.start, b.end),
  );
}

export function weeklyHoursOpenDays(weeklyHours: WeeklyHours) {
  return (Object.keys(weeklyHours) as unknown as number[])
    .map(Number)
    .filter((d) => weeklyHours[d] !== null).length;
}

/**
 * Studio availability label for cards:
 * "Available" / "Limited availability" / "Check availability".
 */
export function availabilityLabel(
  studio: Studio,
  bookings: Array<{ date: string; start: string; hours: number; studioId: string; status: string }>,
): "available" | "limited" | "check" {
  if (studio.status !== "active") return "check";
  const today = todayISO();
  let openSlots = 0;
  for (let i = 1; i <= 7; i++) {
    const iso = addDaysISO(today, i);
    const slots = getSlotsForDate(studio, iso, undefined, bookings);
    openSlots += slots.filter((s) => s.available).length;
    if (openSlots > 12) break;
  }
  if (openSlots === 0) return "check";
  if (openSlots <= 6) return "limited";
  return "available";
}

/** Next bookable day preview, e.g. "Tomorrow, Sat" or weekday name. */
export function nextOpenDay(studio: Studio) {
  const today = todayISO();
  for (let i = 1; i <= 14; i++) {
    const iso = addDaysISO(today, i);
    if (hoursForDate(studio, iso)) return iso;
  }
  return null;
}
