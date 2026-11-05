"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth/session";
import { useRouter, usePathname } from "next/navigation";

/**
 * Client-side gate for authenticated pages. The real backend validates
 * session + ownership server-side; in the demo the gate reassures and
 * redirects, and every action handler re-checks inside the store.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) {
      const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return <AuthGateSkeleton />;
  }
  return <>{children}</>;
}

/** Guests shouldn't see login/register — bounce signed-in users to their profile. */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) {
      router.replace("/profile");
    }
  }, [ready, user, router]);

  // Render the form immediately (nothing private here); the signed-in shell
  // only takes over once hydration confirms an existing session.
  if (ready && user) {
    return <AuthGateSkeleton />;
  }
  return <>{children}</>;
}

function AuthGateSkeleton() {
  return (
    <div className="container-page">
      <div className="flex flex-col gap-6 py-20">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-24 w-full max-w-xl" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-64" />
          <div className="skeleton h-64" />
          <div className="skeleton h-64" />
        </div>
      </div>
    </div>
  );
}
