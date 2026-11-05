"use client";

import type { WeeklyHours } from "@/lib/types";
import { WEEKDAYS } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Day-by-day opening hours editor. `null` = closed. Shared by Add Studio and
 * Edit Studio so the guided flow and later edits never disagree.
 */
export function WeeklyHoursEditor({
  value,
  onChange,
}: {
  value: WeeklyHours;
  onChange: (next: WeeklyHours) => void;
}) {
  const setDay = (day: number, entry: WeeklyHours[number]) => {
    onChange({ ...value, [day]: entry });
  };

  return (
    <div className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
      <table className="w-full text-sm">
        <caption className="sr-only">Weekly opening hours</caption>
        <thead>
          <tr className="border-b border-neutral-200 text-left">
            <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Day
            </th>
            <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Open
            </th>
            <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Hours
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const dayHours = value[day] ?? null;
            const closed = dayHours === null;
            return (
              <tr key={day} className={cn(closed && "bg-neutral-100/60")}>
                <th scope="row" className="px-4 py-3 text-left font-medium text-neutral-950">
                  {WEEKDAYS[day]}
                </th>
                <td className="px-4 py-3">
                  <Switch
                    checked={!closed}
                    onCheckedChange={(openNow) =>
                      setDay(day, openNow ? { open: "10:00", close: "20:00" } : null)
                    }
                    aria-label={openLabel(WEEKDAYS[day], !closed)}
                  />
                </td>
                <td className="px-4 py-3">
                  {closed ? (
                    <span className="text-neutral-500">Closed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <TimeInput
                        value={dayHours.open}
                        onChange={(v) => setDay(day, { open: v, close: dayHours.close })}
                        ariaLabel={`${WEEKDAYS[day]} opening time`}
                      />
                      <span className="text-neutral-500">–</span>
                      <TimeInput
                        value={dayHours.close}
                        onChange={(v) => setDay(day, { open: dayHours.open, close: v })}
                        ariaLabel={`${WEEKDAYS[day]} closing time`}
                      />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-neutral-200 px-4 py-3 text-xs leading-relaxed text-neutral-600">
        Bookable times follow these hours exactly — the calendar shown to
        creators mirrors what you set here.
      </p>
    </div>
  );
}

function openLabel(day: string, isOpen: boolean) {
  return isOpen ? `${day}: open — tap to close` : `${day}: closed — tap to open`;
}

function TimeInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (v) onChange(v);
      }}
      aria-label={ariaLabel}
      className="h-10 rounded-sm border border-neutral-300 bg-neutral-50 px-2.5 text-sm text-neutral-950 outline-none hover:border-neutral-400 focus:border-neutral-950"
    />
  );
}
