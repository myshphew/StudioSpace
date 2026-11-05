"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, Plus, Bookmark, ListChecks, CalendarCheck, User as UserIcon, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/layout/mobile-nav";

const NAV_LINKS = [
  { href: "/studios", label: "Explore" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-brand-canvas/95 backdrop-blur transition-[box-shadow] duration-200",
        scrolled ? "shadow-[0_1px_0_0_var(--color-neutral-200)]" : "shadow-[0_1px_0_0_transparent]",
      )}
    >
      <div className="container-page relative flex h-[68px] items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          aria-label="StudioSpace — home"
          className="rounded-xs outline-offset-4 focus-visible:outline-2"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm text-neutral-700 underline-offset-8 transition-colors hover:text-neutral-950 hover:underline",
                  active && "font-semibold text-neutral-950",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href="/add-studio" className="hidden lg:block">
            <Button variant="secondary" size="sm">
              <Plus className="size-4" aria-hidden />
              List your space
            </Button>
          </Link>
          {user ? (
            <ProfileMenu />
          ) : (
            <>
              <Link href="/login" className="hidden lg:block">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="hidden lg:block">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function ProfileMenu() {
  const { user, refresh } = useSession();
  const router = useRouter();

  if (!user) return null;
  const initial = user.name.trim().charAt(0).toUpperCase() || "S";

  const logout = () => {
    store.signOut();
    refresh();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2.5 rounded-full outline-offset-2 outline-neutral-950 transition-opacity hover:opacity-80 focus-visible:outline-2"
          aria-label="Open account menu"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-neutral-950 font-display text-sm font-bold text-brand-canvas">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="size-9 rounded-full object-cover" />
            ) : (
              initial
            )}
          </span>
          <span className="hidden max-w-28 truncate text-sm font-medium xl:block">{user.name}</span>
          <ChevronsUpDown className="size-3.5 text-neutral-500" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="size-4 text-neutral-500" aria-hidden />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-bookings">
            <CalendarCheck className="size-4 text-neutral-500" aria-hidden />
            My Bookings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites">
            <Heart className="size-4 text-neutral-500" aria-hidden />
            Favorites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Hosting</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/add-studio">
            <Plus className="size-4 text-neutral-500" aria-hidden />
            Add a Studio
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-listings">
            <Bookmark className="size-4 text-neutral-500" aria-hidden />
            My Listings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-listings/requests">
            <ListChecks className="size-4 text-neutral-500" aria-hidden />
            Booking Requests
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout()} className="data-[highlighted]:text-error">
          <LogOut className="size-4 text-neutral-500" aria-hidden />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
