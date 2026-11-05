"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const ACCOUNT_LINKS = [
  { href: "/profile", label: "My Profile" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/favorites", label: "Favorites" },
];

const HOSTING_LINKS = [
  { href: "/add-studio", label: "Add a Studio" },
  { href: "/my-listings", label: "My Listings" },
  { href: "/my-listings/requests", label: "Booking Requests" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, refresh } = useSession();
  const router = useRouter();

  const logout = () => {
    store.signOut();
    refresh();
    setOpen(false);
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex size-10 items-center justify-center rounded-xs text-neutral-950 lg:hidden"
          aria-label="Open navigation"
        >
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="data-[state=open]:anim-sheet right-0 left-auto top-0 h-dvh max-w-sm translate-x-0 translate-y-0 rounded-none border-l border-neutral-200 p-0 sm:max-w-sm sm:max-w-sm">
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex h-[68px] items-center justify-between border-b border-neutral-200 px-5">
            <DialogClose asChild>
              <Link href="/" aria-label="StudioSpace — home">
                <Logo />
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <button
                className="flex size-9 items-center justify-center rounded-xs text-neutral-700 hover:bg-neutral-100"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </DialogClose>
          </div>

          <div className="flex flex-1 flex-col px-5 py-6">
            <p className="eyebrow mb-2">Explore</p>
            <nav className="flex flex-col" aria-label="Mobile">
              {LINKS.map((link) => (
                <DialogClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "border-b border-neutral-200 py-3.5 font-display text-xl font-bold tracking-[-0.03em] text-neutral-950",
                      pathname === link.href && "text-brand-orange",
                    )}
                  >
                    {link.label}
                  </Link>
                </DialogClose>
              ))}
            </nav>

            {user ? (
              <>
                <p className="eyebrow mb-2 mt-8">Account</p>
                <nav className="flex flex-col" aria-label="Account">
                  {ACCOUNT_LINKS.map((link) => (
                    <DialogClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="border-b border-neutral-200 py-3 text-sm font-medium text-neutral-800"
                      >
                        {link.label}
                      </Link>
                    </DialogClose>
                  ))}
                </nav>
                <p className="eyebrow mb-2 mt-6">Hosting</p>
                <nav className="flex flex-col" aria-label="Hosting">
                  {HOSTING_LINKS.map((link) => (
                    <DialogClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="border-b border-neutral-200 py-3 text-sm font-medium text-neutral-800"
                      >
                        {link.label}
                      </Link>
                    </DialogClose>
                  ))}
                </nav>
              </>
            ) : null}
          </div>

          <div className="border-t border-neutral-200 p-5">
            {user ? (
              <div className="flex flex-col gap-2.5">
                <DialogClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/add-studio">
                      <Plus className="size-4" aria-hidden />
                      List Your Space
                    </Link>
                  </Button>
                </DialogClose>
                <Button variant="secondary" className="w-full" onClick={logout}>
                  <LogOut className="size-4" aria-hidden />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <DialogClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/add-studio">List Your Space</Link>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/login">Log in</Link>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button asChild variant="dark" className="w-full">
                    <Link href="/register">Get started</Link>
                  </Button>
                </DialogClose>
              </div>
            )}
            <p className="mt-6 text-center text-xs text-neutral-500">
              Demo build — studio data is fictional.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
