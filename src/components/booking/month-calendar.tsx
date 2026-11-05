"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Studio } from "@/lib/types";
import { addDaysISO, todayISO } from "@/lib/format";
import { getSlotsForDate, hoursForDate, isWithinWindow } from "@/lib/schedule";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export interface MonthCalendarProps {
  studio: Studio;
  bookings: Booking[];
  selected: string | null;
  onSelect: (iso: string) => void;
}

/**
 * Month calendar for the booking panel. States: available, unavailable,
 * selected, past — never color alone; disabled buttons carry aria labels.
 */
export function MonthCalendar({ studio, bookings, selected, onSelect }: MonthCalendarProps) {
  const today = todayISO();
  const [view, setView] = useState(() => monthOf(today));

  const { grid, label, canPrev, canNext } = useMemo(() => {
    const [year, month] = view.split("-").map(Number);
    const first = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const lead = (first.getDay() + 7) % 7;
    const cells: Array<{ iso: string | null } | { iso: string }> = [];
    for (let i = 0; i < lead; i++) cells.push({ iso: null });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        iso: `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
    const prevKey = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
    const nextKey = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;
    const prevProbe = `${prevKey}-15`;
    const nextProbe = `${nextKey}-01`;
    const farthest = addDaysISO(today, studio.advanceWindowDays);
    return {
      grid: cells,
      label: first.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      canPrev: prevProbe >= today,
      canNext: nextProbe <= farthest,
    };
  }, [view, studio, today]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(shiftMonth(view, -1))}
          disabled={!canPrev}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-xs text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-semibold text-neutral-950" aria-live="polite">
          {label}
        </p>
        <button
          type="button"
          onClick={() => setView(shiftMonth(view, 1))}
          disabled={!canNext}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-xs text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label={`Available dates — ${label}`}>
        {WEEKDAY_LABELS.map((d, i) => (
          <p key={`${d}-${i}`} className="pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            {d}
          </p>
        ))}
        {grid.map((cell, i) => {
          if (!cell.iso) return <span key={`pad-${i}`} />;
          const iso = cell.iso;
          if (iso < today || !isWithinWindow(studio, iso)) {
            return (
              <span
                key={iso}
                aria-disabled
                className={cn("flex h-9 items-center justify-center rounded-xs text-sm text-neutral-400 line-through decoration-neutral-300")}
              >
                {Number(iso.slice(-2))}
              </span>
            );
          }
          const day = stateForDate(studio, iso, bookings);
          const isSelected = selected === iso;
          const disabled = day === "closed";
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              aria-pressed={isSelected}
              aria-label={dateAriaLabel(iso, day)}
              className={cn(
                "flex h-9 items-center justify-center rounded-xs text-sm transition-colors",
                !isSelected && "hover:bg-neutral-100",
                day === "open" && !isSelected && "text-neutral-950 border border-neutral-200",
                day === "closed" && "text-neutral-400",
                isSelected && "bg-neutral-950 font-semibold text-brand-canvas",
              )}
            >
              {Number(iso.slice(-2))}
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-4 text-[11px] text-neutral-500">
        <Legend swatch="bg-neutral-950" label="Selected" />
        <Legend swatch="border border-neutral-200 bg-transparent" label="Open" />
        <Legend swatch="text-neutral-300" label="Unavailable" />
      </p>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("inline-block size-2.5 rounded-xs", swatch)} aria-hidden />
      {label}
    </span>
  );
}

type DayState = "open" | "closed";

function stateForDate(
  studio: Studio,
  iso: string,
  bookings: Booking[],
): DayState {
  const hours = hoursForDate(studio, iso);
  if (!hours) return "closed";
  const slots = getSlotsForDate(studio, iso, undefined, bookings);
  return slots.some((s) => s.available) ? "open" : "closed";
}

/** Every past/disabled cell still reads clearly to screen readers. */
export function dateAriaLabel(iso: string, state: DayState) {
  const date = new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return state === "open" ? `${date} — available` : `${date} — unavailable`;
}

function monthOf(iso: string) {
  return iso.slice(0, 7);
}

function shiftMonth(monthKey: string, delta: number) {
  const [y, m] = monthKey.split("-").map(Number);
  const next = new Date(y, m - 1 + delta, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}
