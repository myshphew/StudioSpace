"use client";

import { useSyncExternalStore, useMemo } from "react";
import * as store from "@/lib/demo/store";
import type { DemoData } from "@/lib/demo/store";
import type { Studio } from "@/lib/types";
import { availabilityLabel } from "@/lib/schedule";

/**
 * Read the demo data store with SSR-safe semantics: prerender/first paint see
 * the empty snapshot, and real persisted values replace it after hydration.
 */
export function useDemoData(): DemoData {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerDataSnapshot,
  );
}

const EMPTY: DemoData = {
  users: [],
  bookings: [],
  listings: [],
  favorites: {},
  seededFor: [],
  bookingSeq: 0,
};

function getServerDataSnapshot(): DemoData {
  return EMPTY;
}

/* ------------------------------------------------------------------ */
/* mounted flag                                                        */
/* ------------------------------------------------------------------ */

/**
 * Tiny external store that flips from `false` (server snapshot) to `true`
 * after mount. Components use it to defer date-dependent work (like
 * availability labels) to the client without setState-in-effect or
 * hydration mismatches, and it survives the Cache Components prerender
 * guard because nothing time-dependent runs during prerender.
 */

let isMounted = false;
const mountedListeners = new Set<() => void>();

function subscribeMounted(fn: () => void) {
  mountedListeners.add(fn);
  if (!isMounted) {
    isMounted = true;
    queueMicrotask(() => {
      for (const listener of mountedListeners) listener();
    });
  }
  return () => {
    mountedListeners.delete(fn);
  };
}

function getMountedSnapshot(): boolean {
  return isMounted;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );
}

/* ------------------------------------------------------------------ */
/* availability labels                                                 */
/* ------------------------------------------------------------------ */

type AvailabilityLabel = "available" | "limited" | "check";

const NO_LABELS: Record<string, AvailabilityLabel> = {};

/**
 * Availability labels ("Available" / "Limited availability" / "Check
 * availability") are date-dependent, so they resolve only on the client —
 * the fallback map keeps prerender and hydration paints label-free.
 */
export function useAvailabilityFor(
  studios: Studio[],
): Record<string, AvailabilityLabel> {
  const mounted = useMounted();
  const bookings = useDemoData().bookings;

  return useMemo(() => {
    if (!mounted) return NO_LABELS;
    const next: Record<string, AvailabilityLabel> = {};
    for (const studio of studios) {
      next[studio.id] = availabilityLabel(studio, bookings);
    }
    return next;
  }, [studios, bookings, mounted]);
}
