"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/lib/types";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { useDemoData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";

export function ProfileContent() {
  const { user } = useSession();
  const data = useDemoData();

  if (!user) return null;

  // Counts derive from the subscribed snapshot, not store getters, so this
  // renders pure and updates the moment any booking/favorite changes.
  const myListingCount = data.listings.filter((l) => l.ownerId === user.id).length;
  const myBookingCount = data.bookings.filter((b) => b.creatorId === user.id).length;
  const favoritesCount = (data.favorites[user.id] ?? []).length;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Keyed by user id: the form seeds from the user at mount and survives
          profile updates; a different account remounts with fresh values. */}
      <ProfileForm key={user.id} user={user} />

      <aside className="flex h-fit flex-col gap-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
        <p className="eyebrow">At a glance</p>
        <dl className="flex flex-col gap-4 text-sm">
          <Stat label="Listings" value={String(myListingCount)} />
          <Stat label="Bookings" value={String(myBookingCount)} />
          <Stat label="Favorites" value={String(favoritesCount)} />
        </dl>
        {data.listings.length === 0 ? (
          <p className="text-xs leading-relaxed text-neutral-500">
            No listings yet — Add a Studio makes the first one a five-step walk.
          </p>
        ) : null}
      </aside>
    </div>
  );
}

function ProfileForm({ user }: { user: User }) {
  const { refresh } = useSession();

  const [form, setForm] = useState(() => ({
    name: user.name,
    location: user.location ?? "",
    bio: user.bio ?? "",
  }));
  const [nameError, setNameError] = useState<string | null>(null);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError("Your profile needs a name.");
      return;
    }
    setNameError(null);
    store.updateProfile({
      name: form.name.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
    });
    refresh();
    toast.success("Profile updated.");
  };

  return (
    <form onSubmit={save} className="flex max-w-2xl flex-col gap-6" noValidate>
      {nameError ? (
        <p className="rounded-sm bg-error-soft px-4 py-3 text-sm text-error" role="alert">
          {nameError}
        </p>
      ) : null}

      <div className="flex items-center gap-5">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-display text-xl font-bold text-brand-canvas">
          {initialText(user.name) || "S"}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-lg font-bold tracking-[-0.02em] text-neutral-950">
            {user.name}
          </p>
          <p className="text-sm text-neutral-600">Member since {memberSince}</p>
        </div>
      </div>

      <Field label="Full name" htmlFor="profile-name" required error={nameError}>
        <Input
          id="profile-name"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
          aria-invalid={Boolean(nameError)}
        />
      </Field>

      <Field label="Email address" htmlFor="profile-email" hint="Your email anchors the account and stays as-is in this build.">
        <Input id="profile-email" value={user.email} disabled readOnly />
      </Field>

      <Field label="Location" htmlFor="profile-location" hint="Neighbourhood or city — shown on your listings if you host.">
        <Input
          id="profile-location"
          value={form.location}
          onChange={(e) => patch({ location: e.target.value })}
          placeholder="Dhanmondi, Dhaka"
        />
      </Field>

      <Field label="Short bio" htmlFor="profile-bio" hint="A couple of lines about what you make.">
        <Textarea
          id="profile-bio"
          value={form.bio}
          onChange={(e) => patch({ bio: e.target.value })}
          placeholder="Photographer, filmmaker or the one with the podcast..."
          className="min-h-32"
        />
      </Field>

      <div className="flex items-center justify-start gap-4">
        <Button type="submit">Save Profile</Button>
        <button
          type="button"
          onClick={() => setForm({ name: user.name, location: user.location ?? "", bio: user.bio ?? "" })}
          className="text-sm text-neutral-600 underline-offset-4 hover:text-neutral-950 hover:underline"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

function initialText(name: string) {
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-neutral-600">{label}</dt>
      <dd className="font-display text-lg font-bold text-neutral-950">{value}</dd>
    </div>
  );
}
