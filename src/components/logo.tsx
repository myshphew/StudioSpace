import { cn } from "@/lib/utils";

/** The `std_` brand mark — an empty canvas plus a creative cursor. */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-baseline font-display text-2xl font-black tracking-[-0.02em]",
        dark ? "text-brand-canvas" : "text-neutral-950",
        className,
      )}
    >
      std<span className="text-brand-orange">_</span>
    </span>
  );
}
