"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { formatDate } from "@/lib/format";

/**
 * Blocked-date editor for listings: maintenance days, private shoots,
 * holidays. Dates are sorted ISO strings (`yyyy-mm-dd`), newest logic-free.
 */
export function UnavailableDatesEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const iso = input;
    if (!iso) return;
    if (value.includes(iso)) {
      setInput("");
      return;
    }
    onChange([...value, iso].sort());
    setInput("");
  };

  const remove = (iso: string) => {
    onChange(value.filter((d) => d !== iso));
  };

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-end gap-3">
        <div className="max-w-52 flex-1">
          <label htmlFor="unavailable-date" className="mb-2 block text-[13px] font-medium text-neutral-800">
            Add a blocked date
          </label>
          <input
            id="unavailable-date"
            type="date"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 w-full rounded-sm border border-neutral-300 bg-neutral-50 px-4 text-sm text-neutral-950 outline-none hover:border-neutral-400 focus:border-neutral-950"
          />
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!input}
          className="h-12 shrink-0 rounded-sm bg-neutral-950 px-5 text-sm font-semibold text-brand-canvas transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          Add date
        </button>
      </div>

      {value.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-600">
          Nothing blocked yet — every date follows your weekly hours.
        </p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {value.map((iso) => (
            <li key={iso}>
              <button
                type="button"
                onClick={() => remove(iso)}
                className="flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 py-1.5 pl-3.5 pr-2 text-[13px] text-neutral-900 transition-colors hover:border-error hover:text-error"
                aria-label={`Unblock ${formatDate(iso)}`}
              >
                {formatDate(iso)}
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
