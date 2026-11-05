"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { SessionProvider } from "@/lib/auth/session";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
    return () => lenis.destroy();
  }, []);

  return (
    <SessionProvider>
      {children}
      <Toaster position="bottom-right" toastOptions={{ classNames: toastClasses }} />
    </SessionProvider>
  );
}

const toastClasses = {
  toast:
    "!bg-neutral-50 !border !border-neutral-200 !rounded-md !text-neutral-950 !shadow-dropdown !font-sans !text-sm",
  description: "!text-neutral-600",
  success: "[&_svg]:text-success",
  error: "[&_svg]:text-error",
};
