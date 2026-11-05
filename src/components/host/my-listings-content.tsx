"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarCheck, Eye, MoreHorizontal, Pencil, Send } from "lucide-react";
import type { ListingStatus } from "@/lib/types";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import type { OwnedStudio } from "@/lib/demo/store";
import { useDemoData } from "@/lib/hooks";
import { formatBDT } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListingStatusBadge } from "@/components/status";
import { StudioImage } from "@/components/studio/studio-image";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export function MyListingsContent() {
  const { user, ready } = useSession();
  const data = useDemoData();
  const [filter, setFilter] = useState<FilterValue>("all");

  if (!user || !ready) return null;

  // Pure derivations from the subscribed snapshot.
  const listings = data.listings.filter((l) => l.ownerId === user.id);
  const listingIds = new Set(listings.map((l) => l.id));
  const pendingRequests = data.bookings.filter(
    (b) => listingIds.has(b.studioId) && b.status === "pending",
  ).length;

  if (!user || !ready) return null;

  const visible =
    filter === "all" ? listings : listings.filter((l) => l.status === filter);

  return (
    <div className="flex flex-col gap-10">
      {pendingRequests > 0 ? (
        <Link
          href="/my-listings/requests"
          className="group flex flex-wrap items-center gap-4 rounded-md border border-neutral-200 bg-neutral-50 px-5 py-4 transition-colors hover:border-neutral-950"
        >
          <Send className="size-4 text-brand-orange" aria-hidden />
          <span className="text-sm text-neutral-800">
            <strong className="font-semibold text-neutral-950">{pendingRequests}</strong>{" "}
            booking {pendingRequests === 1 ? "request" : "requests"} waiting on your approval
          </span>
          <span className="text-sm font-semibold text-neutral-950 underline underline-offset-4 group-hover:no-underline">
            Review requests
          </span>
        </Link>
      ) : null}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
                <span className="ml-1.5 text-xs text-neutral-500">
                  {f.value === "all"
                    ? listings.length
                    : listings.filter((l) => l.status === f.value).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button asChild size="sm" className="self-start sm:self-auto">
          <Link href="/add-studio">Add a Studio</Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title="No studios yet."
          description="Your first listing starts with five short steps. Add it, review it, then publish when it feels right."
          action={
            <Button asChild>
              <Link href="/add-studio">Add a Studio</Link>
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="Nothing in this state."
          description="No listings match this filter right now."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((listing) => (
            <ListingRow key={listing.id} listing={listing} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ListingRow({ listing }: { listing: OwnedStudio }) {
  const canSee = listing.status !== "draft";
  const hero = listing.images[0] ?? "";

  return (
    <li className="flex flex-col gap-5 rounded-md border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <Link
        href={canSee ? `/studios/${listing.id}` : `/my-listings/${listing.id}/edit`}
        className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-100 sm:aspect-auto sm:size-24 sm:shrink-0"
      >
        <StudioImage
          src={hero}
          alt={listing.name}
          sizes="120px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/my-listings/${listing.id}/edit`}
            className="font-display text-lg font-bold tracking-[-0.025em] text-neutral-950 hover:text-brand-orange"
          >
            {listing.name}
          </Link>
          <ListingStatusBadge status={listing.status} />
        </div>
        <p className="text-sm text-neutral-700">
          {listing.area}, {listing.city} · {listing.capacity} people
        </p>
        <p className="text-xs text-neutral-500">
          {formatBDT(listing.hourlyRate)} / hour
          {listing.securityDeposit > 0 ? ` · deposit ${formatBDT(listing.securityDeposit)}` : ""}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2.5">
        {canSee ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/studios/${listing.id}`}>
              <Eye className="size-4" aria-hidden />
              View
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="ghost" size="sm">
          <Link href={`/my-listings/${listing.id}/bookings`}>
            <CalendarCheck className="size-4" aria-hidden />
            Bookings
          </Link>
        </Button>
        <StatusActions listing={listing} />
      </div>
    </li>
  );
}

function StatusActions({ listing }: { listing: OwnedStudio }) {
  const changeStatus = (status: ListingStatus, message: string, description?: string) => {
    store.setListingStatus(listing.id, status);
    toast(message, description ? { description } : undefined);
  };

  return (
    <>
      {listing.status === "draft" ? (
        <Button
          size="sm"
          onClick={() =>
            changeStatus(
              "active",
              "Listing published.",
              "Creators can find it and send booking requests.",
            )
          }
        >
          Publish
        </Button>
      ) : null}
      {listing.status === "paused" || listing.status === "archived" ? (
        <Button
          size="sm"
          onClick={() =>
            changeStatus(
              "active",
              listing.status === "paused" ? "Listing is live again." : "Listing restored.",
              "Open to new booking requests.",
            )
          }
        >
          {listing.status === "paused" ? "Reopen" : "Restore"}
        </Button>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" aria-label={`More actions for ${listing.name}`}>
            <MoreHorizontal className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/my-listings/${listing.id}/edit`}>
              <Pencil className="size-4 text-neutral-500" aria-hidden />
              Edit listing
            </Link>
          </DropdownMenuItem>
          {listing.status === "active" ? (
            <DropdownMenuItem
              onSelect={() =>
                changeStatus(
                  "paused",
                  "Listing paused.",
                  "It stops taking new booking requests until you reopen it.",
                )
              }
            >
              Pause listing
            </DropdownMenuItem>
          ) : null}
          {listing.status !== "archived" ? (
            <DropdownMenuItem
              className="data-[highlighted]:text-error"
              onSelect={() =>
                changeStatus(
                  "archived",
                  "Listing archived.",
                  "Not shown in search or able to take requests.",
                )
              }
            >
              Archive listing
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
