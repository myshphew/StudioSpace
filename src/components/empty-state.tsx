import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/** Shared empty state panel per the content guide. */
export function EmptyState({
  title,
  description,
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-neutral-100/60 px-8 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-500 shadow-card">
          {icon}
        </div>
      ) : null}
      <p className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
        {title}
      </p>
      <p className="max-w-md text-sm leading-relaxed text-neutral-600">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Marked-duplicate guard: availability/price shown on cards lives with the card. */
export function DemoDataNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-[11px] uppercase tracking-[0.08em] text-neutral-500", className)}>
      Demo data — fictional spaces for design review
    </p>
  );
}
