import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-12 w-full rounded-sm border border-neutral-300 bg-neutral-50 px-4 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors duration-150 outline-none",
        "hover:border-neutral-400",
        "focus:border-neutral-950 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-600",
        "aria-invalid:border-error aria-invalid:bg-error-soft",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-sm border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors duration-150 outline-none",
        "hover:border-neutral-400",
        "focus:border-neutral-950 focus-visible:outline-none",
        "aria-invalid:border-error aria-invalid:bg-error-soft",
        className,
      )}
      {...props}
    />
  );
}

function Label({
  className,
  children,
  required,
  ...props
}: React.ComponentProps<"label"> & { required?: boolean }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "block text-[13px] font-medium text-neutral-800",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="ml-0.5 text-brand-orange">
          *
        </span>
      ) : null}
    </label>
  );
}

interface FieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  required?: boolean;
}

/** Label-above-input wrapper with helper text below the field. */
function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
  required,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      {children}
      {error ? (
        <p className="text-[13px] text-error" aria-live="polite">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13px] leading-relaxed text-neutral-600">{hint}</p>
      ) : null}
    </div>
  );
}

export { Input, Textarea, Label, Field };
