import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-xs px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
  {
    variants: {
      tone: {
        neutral: "bg-neutral-100 text-neutral-700",
        outline: "border border-neutral-300 bg-transparent text-neutral-600",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        error: "bg-error-soft text-error",
        info: "bg-info-soft text-info",
        orange: "bg-brand-orange text-brand-charcoal",
        dark: "bg-neutral-950 text-brand-canvas",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
