"use client";

import { useState } from "react";
import type { Booking } from "@/lib/types";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { useDemoData } from "@/lib/hooks";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingRequestCard } from "@/components/host/booking-request-card";
import Link from "next/link";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "history", label: "History" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function RequestsQueueContent() {
  const { user, ready } = useSession();
  const data = useDemoData();
  const [tab, setTab] = useState<TabValue>("pending");

  if (!user || !ready) return null;

  // Pure derivations from the subscribed snapshot — newest first, like the
  // store getter this replaces.
  const ownedIds = new Set(
    data.listings.filter((l) => l.ownerId === user.id).map((l) => l.id),
  );
  const requests = data.bookings
    .filter((b) => ownedIds.has(b.studioId))
    .sort((a, b) => b.createdAt - a.createdAt);

  if (!user || !ready) return null;

  const pending = requests.filter((b) => displayOf(b) === "pending");
  const confirmed = requests.filter((b) => displayOf(b) === "confirmed");
  const history = requests.filter((b) =>
    ["completed", "cancelled", "declined", "expired"].includes(displayOf(b)),
  );

  const lists: Record<TabValue, Booking[]> = { pending, confirmed, history };
  const visible = lists[tab];
  const hasAny = requests.length > 0;

  return (
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
            description="When creators want your space, their requests land here, ready for your call."
            action={
              <Button asChild variant="secondary">
                <Link href="/my-listings">My Listings</Link>
              </Button>
            }
          />
        </div>
      ) : null}

      {hasAny ? (
        <TabsContent value={tab} forceMount className="mt-8">
          {visible.length === 0 ? (
            <EmptyState
              title={
                tab === "pending"
                  ? "Inbox at zero."
                  : tab === "confirmed"
                    ? "Nothing confirmed right now."
                    : "History starts after your first decisions."
              }
              description={
                tab === "pending"
                  ? "New requests arrive here first. Nothing is confirmed until you approve it."
                  : "Nothing in this state yet."
              }
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {visible.map((b) => (
                <BookingRequestCard key={b.id} booking={b} />
              ))}
            </ul>
          )}
        </TabsContent>
      ) : null}
    </Tabs>
  );
}

function displayOf(b: Booking): string {
  return store.displayStatus(b);
}
