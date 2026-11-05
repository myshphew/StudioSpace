"use client";

import { useMounted } from "@/lib/hooks";

/**
 * Current year, resolved on the client — Cache Components forbids clock
 * reads during prerender. The mounted external store defers the clock read
 * to the first post-hydration render without setState-in-effect.
 */
export function FooterYear() {
  const mounted = useMounted();
  return <span>{mounted ? new Date().getFullYear() : ""}</span>;
}
