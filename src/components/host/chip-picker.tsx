"use client";

import { useState } from "react";

/**
 * Selectable chip picker with optional custom entries — used for equipment
 * and amenities across Add Studio and Edit Studio.
 */
export function ChipPicker({
  label,
  hint,
  options,
  value,
  onChange,
  addLabel = "Add",
  inputId,
  onDirty,
}: {
  label: string;
  hint?: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
  inputId?: string;
  onDirty?: () => void;
}) {
  const [custom, setCustom] = useState("");
  const extras = value.filter((v) => !options.includes(v));

  const toggle = (item: string) => {
    onChange(
      value.includes(item)
        ? value.filter((v) => v !== item)
        : [...value, item],
    );
    onDirty?.();
  };

  const addCustom = () => {
    const item = custom.trim();
    if (!item || value.includes(item)) return;
    onChange([...value, item]);
    setCustom("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-medium text-neutral-800">{label}</p>
        {hint ? <p className="text-[13px] leading-relaxed text-neutral-600">{hint}</p> : null}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(option)}
              className={cnChip(active)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {extras.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label={`${label} — custom entries`}>
          {extras.map((extra) => (
            <button
              key={extra}
              type="button"
              onClick={() => toggle(extra)}
              className={cnChip(true)}
            >
              {extra}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <input
          id={inputId}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Add your own..."
          className="h-10 w-full max-w-56 rounded-sm border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-950 outline-none hover:border-neutral-400 focus:border-neutral-950"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="h-10 shrink-0 rounded-sm border border-neutral-300 px-4 text-sm font-semibold text-neutral-950 transition-colors hover:border-neutral-950 disabled:opacity-50"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}

function cnChip(active: boolean) {
  return [
    "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
    active
      ? "border-neutral-950 bg-neutral-950 text-brand-canvas"
      : "border-neutral-300 bg-transparent text-neutral-700 hover:border-neutral-500",
  ].join(" ");
}
