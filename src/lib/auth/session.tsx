"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, useMemo } from "react";
import * as store from "@/lib/demo/store";
import type { User } from "@/lib/types";

interface SessionValue {
  /** Signed-in user or null. */
  user: User | null;
  /** True once the client has hydrated the persisted session. */
  ready: boolean;
  /** Kept for callers that mutate the account; the store subscription does the real refresh. */
  refresh: () => void;
}

const SessionContext = createContext<SessionValue>({
  user: null,
  ready: false,
  refresh: () => {},
});

/** Prerender/hydration paint: nothing looks signed in until the store is read. */
const SERVER_SESSION = { user: null, ready: false };

const NOT_SIGNED_IN: SessionValue = { user: null, ready: true, refresh: () => {} };

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Seed the demo account + demo content once per page load.
  useEffect(() => {
    store.ensureDemoAccount();
  }, []);

  // The store is the external system; its snapshot carries ready + user, so
  // React reloads the session through its subscription — no setState-in-effect.
  const session = useSyncExternalStore(
    store.subscribe,
    store.getSessionSnapshot,
    () => SERVER_SESSION,
  );

  const value = useMemo<SessionValue>(
    () =>
      session.user
        ? { user: session.user, ready: session.ready, refresh: () => {} }
        : NOT_SIGNED_IN,
    [session],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
