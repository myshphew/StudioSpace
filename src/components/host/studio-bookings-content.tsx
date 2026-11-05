"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Booking } from "@/lib/types";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { useDemoData } from "@/lib/hooks";
import { formatBDT } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingStatusBadge } from "@/components/status";
import { BookingRequestCard } from "@/components/host/booking-request-card";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "history", label: "History" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function StudioBookingsContent() {
  const { user, ready } = useSession();
  const data = useDemoData();
  const routeId = useParams().id as string;
  const [tab, setTab] = useState<TabValue>("pending");

  if (!ready) return null;

  if (!user) {
    return <NoPermission />;
  }

  // Ownership from the subscribed snapshot; RequireAuth only lets children
  // through once the store is hydrated, so a miss is genuine.
  const listing =
    data.listings.find((l) => l.ownerId === user.id && l.id === routeId) ?? null;

  if (!listing) return <NoPermission />;

  // Pure derivation — newest first, scoped to this studio.
  const requests = data.bookings
    .filter((b) => b.studioId === routeId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const pending = requests.filter((b) => store.displayStatus(b) === "pending");
  const confirmed = requests.filter((b) => store.displayStatus(b) === "confirmed");
  const history = requests.filter((b) =>
    ["completed", "cancelled", "declined", "expired"].includes(store.displayStatus(b) as string),
  );

  const lists: Record<TabValue, Booking[]> = { pending, confirmed, history };
  const visible = lists[tab];
  const hasAny = requests.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-neutral-200 bg-neutral-50 px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-display text-lg font-bold tracking-[-0.025em] text-neutral-950">
            {listing.name}
          </p>
          <ListingStatusBadge status={listing.status} />
        </div>
        <div className="flex flex-wrap gap-2.5">
          <span className="text-sm text-neutral-600">
            {formatBDT(listing.hourlyRate)} / hour
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/my-listings/${listing.id}/edit`}>Edit Listing</Link>
          </Button>
        </div>
      </div>

      {listing.status === "draft" && hasAny ? (
        <p className="rounded-sm bg-warning-soft px-4 py-3 text-sm text-neutral-800">
          This listing is a draft, yet it has requests — publish it before they
          can turn into confirmed bookings.
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
              <span className="ml-1.5 text-xs text-neutral-500">{lists[t.value].length}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {!hasAny ? (
          <div className="mt-10">
            <EmptyState
              title="No requests yet."
              description="Spread the word — the listing shines when the first creator brings a session."
              action={
                <Button asChild variant="secondary">
                  <Link href={`/studios/${listing.id}`}>View Listing</Link>
                </Button>
              }
            />
          </div>
        ) : null}

        {hasAny ? (
          <TabsContent value={tab} forceMount>
            {visible.length === 0 ? (
              <EmptyState
                title={
                  tab === "pending"
                    ? "Inbox at zero."
                    : tab === "confirmed"
                      ? "No confirmed sessions right now."
                      : "History fills up as requests resolve."
                }
                description="Nothing in this state yet."
              />
            ) : (
              <ul className="flex flex-col gap-4">
                {visible.map((b) => (
                  <BookingRequestCard key={b.id} booking={b} showStudio={false} />
                ))}
              </ul>
            )}
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  );
}

function NoPermission() {
  return (
    <div className="flex flex-col items-start gap-5 rounded-md border border-dashed border-neutral-300 bg-neutral-100/60 px-8 py-14">
      <div>
        <p className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
          You don&rsquo;t have permission to host this studio&rsquo;s bookings.
        </p>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-600">
          Only the studio&rsquo;s host sees this register. If it&rsquo;s yours,
          log in with the account that listed it.
        </p>
      </div>
      <Button asChild variant="secondary">
        <Link href="/my-listings">Back to My Listings</Link>
      </Button>
    </div>
  );
}
