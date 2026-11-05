"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { X, ImageIcon } from "lucide-react";
import type { Studio, WeeklyHours } from "@/lib/types";
import { AMENITIES_LIBRARY, CATEGORY_META, CATEGORY_ORDER, EQUIPMENT_PRESETS, LISTING_STATUS_META } from "@/lib/constants";
import { IMG } from "@/lib/demo/images";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import type { OwnedStudio } from "@/lib/demo/store";
import { useDemoData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ChipPicker } from "@/components/host/chip-picker";
import { WeeklyHoursEditor } from "@/components/host/weekly-hours-editor";
import { UnavailableDatesEditor } from "@/components/host/unavailable-dates-editor";
import { ListingStatusBadge } from "@/components/status";

const SAMPLE_ADDITIONS = [
  IMG.photoStudioCyc,
  IMG.cameraFlatlay,
  IMG.canonDslr,
  IMG.whiteDaylight,
  IMG.loungeSofa,
  IMG.glassCorridor,
  IMG.stageMic,
  IMG.condenserMic,
  IMG.musicRoomGuitars,
  IMG.galleryWall,
];

type Editable = Pick<
  Studio,
  | "name"
  | "category"
  | "area"
  | "city"
  | "address"
  | "tagline"
  | "description"
  | "capacity"
  | "sizeSqft"
  | "hourlyRate"
  | "securityDeposit"
  | "minHours"
  | "maxHours"
  | "cancellationPolicy"
  | "images"
  | "equipment"
  | "amenities"
  | "weeklyHours"
  | "unavailableDates"
  | "advanceWindowDays"
>;

export function EditStudioContent() {
  const { user, ready } = useSession();
  const data = useDemoData();
  const routeId = useParams().id as string;

  if (!ready) return null;
  if (!user) return <NoPermission />;

  // Ownership is derived from the subscribed snapshot. RequireAuth only lets
  // children through once the session store is hydrated, so the listings are
  // already loaded here — a miss really means "not yours or not found".
  const listing =
    data.listings.find((l) => l.ownerId === user.id && l.id === routeId) ?? null;

  if (!listing) return <NoPermission />;

  const status = listing.status;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-center gap-4 rounded-md border border-neutral-200 bg-neutral-50 px-5 py-4">
        <ListingStatusBadge status={status} />
        <p className="text-sm text-neutral-700">{LISTING_STATUS_META[status].description}</p>
        <div className="ml-auto flex flex-wrap gap-2.5">
          {status === "draft" ? (
            <Button
              size="sm"
              onClick={() => {
                store.setListingStatus(listing.id, "active");
                toast.success("Listing published.", {
                  description: "Creators can find it and send booking requests.",
                });
              }}
            >
              Publish
            </Button>
          ) : null}
          {status === "active" ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                store.setListingStatus(listing.id, "paused");
                toast("Listing paused.", {
                  description: "It'll stop taking new requests until you reopen it.",
                });
              }}
            >
              Pause
            </Button>
          ) : null}
          {status === "paused" || status === "archived" ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                store.setListingStatus(listing.id, "active");
                toast("Listing is live again.", { description: "Open to new booking requests." });
              }}
            >
              Reopen
            </Button>
          ) : null}
          <Button asChild size="sm" variant="ghost">
            <Link href={`/my-listings/${listing.id}/bookings`}>Bookings</Link>
          </Button>
        </div>
      </div>

      {/* Keyed by listing id: the form seeds at mount and keeps typed values
          across store updates; editing a different listing remounts fresh. */}
      <ListingForm key={listing.id} listing={listing} />
    </div>
  );
}

function ListingForm({ listing }: { listing: OwnedStudio }) {
  const [form, setForm] = useState<Editable>(() => seedForm(listing));
  const [saving, setSaving] = useState(false);

  const patch = (p: Partial<Editable>) => setForm((f) => (f ? { ...f, ...p } : f));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Your listing needs a name before it can save.");
      return;
    }
    if (form.images.length === 0) {
      toast.error("Keep at least one photo on the listing.");
      return;
    }
    setSaving(true);
    store.updateListing(listing.id, {
      ...form,
      name: form.name.trim(),
      capacity: Math.max(1, Number(form.capacity)),
      sizeSqft: Math.max(50, Number(form.sizeSqft)),
      hourlyRate: Math.max(100, Number(form.hourlyRate)),
      securityDeposit: Math.max(0, Number(form.securityDeposit)),
      minHours: Math.max(1, Number(form.minHours)),
      maxHours: Math.max(Number(form.minHours) || 1, Number(form.maxHours)),
      advanceWindowDays: Math.max(7, Number(form.advanceWindowDays)),
      unavailableDates: [...form.unavailableDates],
      images: [...form.images],
      equipment: [...form.equipment],
      amenities: [...form.amenities],
    });
    setSaving(false);
    toast.success("Listing updated.");
  };

  return (
    <form onSubmit={save} className="flex max-w-3xl flex-col gap-16" noValidate>
      {/* Basics */}
      <section className="flex flex-col gap-6" aria-labelledby="edit-basics">
        <h2 id="edit-basics" className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
          The basics
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Studio name" htmlFor="e-name" className="sm:col-span-2">
            <Input id="e-name" value={form.name} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="Studio category" htmlFor="e-category" className="sm:col-span-2">
            <Select
              value={form.category}
              onValueChange={(v) => patch({ category: v as Editable["category"] })}
            >
              <SelectTrigger id="e-category" aria-label="Studio category">
                {CATEGORY_META[form.category].label}
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Area / neighbourhood" htmlFor="e-area">
            <Input id="e-area" value={form.area} onChange={(e) => patch({ area: e.target.value })} />
          </Field>
          <Field label="City" htmlFor="e-city">
            <Input id="e-city" value={form.city} onChange={(e) => patch({ city: e.target.value })} />
          </Field>
          <Field label="Full address" htmlFor="e-address" className="sm:col-span-2">
            <Input id="e-address" value={form.address} onChange={(e) => patch({ address: e.target.value })} />
          </Field>
          <Field label="Tagline" htmlFor="e-tagline" className="sm:col-span-2">
            <Input id="e-tagline" value={form.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
          </Field>
          <Field label="Description" htmlFor="e-desc" className="sm:col-span-2" hint="Separate paragraphs with a blank line.">
            <Textarea
              id="e-desc"
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              className="min-h-32"
            />
          </Field>
          <Field label="Capacity" htmlFor="e-capacity">
            <Input
              id="e-capacity"
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => patch({ capacity: Number(e.target.value) })}
            />
          </Field>
          <Field label="Size (sq. ft.)" htmlFor="e-size">
            <Input
              id="e-size"
              type="number"
              min={50}
              value={form.sizeSqft}
              onChange={(e) => patch({ sizeSqft: Number(e.target.value) })}
            />
          </Field>
        </div>
      </section>

      {/* Pricing */}
      <section className="flex flex-col gap-6" aria-labelledby="edit-pricing">
        <h2 id="edit-pricing" className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
          Pricing
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Hourly rate (৳)" htmlFor="e-rate">
            <Input
              id="e-rate"
              type="number"
              min={100}
              value={form.hourlyRate}
              onChange={(e) => patch({ hourlyRate: Number(e.target.value) })}
            />
          </Field>
          <Field label="Security deposit (৳)" htmlFor="e-deposit">
            <Input
              id="e-deposit"
              type="number"
              min={0}
              value={form.securityDeposit}
              onChange={(e) => patch({ securityDeposit: Number(e.target.value) })}
            />
          </Field>
          <Field label="Minimum booking" htmlFor="e-min">
            <Input
              id="e-min"
              type="number"
              min={1}
              value={form.minHours}
              onChange={(e) => patch({ minHours: Number(e.target.value) })}
            />
          </Field>
          <Field label="Maximum booking" htmlFor="e-max">
            <Input
              id="e-max"
              type="number"
              min={1}
              value={form.maxHours}
              onChange={(e) => patch({ maxHours: Number(e.target.value) })}
            />
          </Field>
          <Field label="Cancellation policy" htmlFor="e-cancel" className="sm:col-span-2">
            <Select
              value={form.cancellationPolicy}
              onValueChange={(v) => patch({ cancellationPolicy: v as Editable["cancellationPolicy"] })}
            >
              <SelectTrigger id="e-cancel" aria-label="Cancellation policy">
                {form.cancellationPolicy === "flexible" ? "Flexible" : form.cancellationPolicy === "moderate" ? "Moderate" : "Strict"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible — free up to 24 hours before</SelectItem>
                <SelectItem value="moderate">Moderate — free up to 3 days before</SelectItem>
                <SelectItem value="strict">Strict — reviewed case by case</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      {/* Photos, equipment, amenities */}
      <section className="flex flex-col gap-6" aria-labelledby="edit-photos">
        <h2 id="edit-photos" className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
          Photos, equipment & amenities
        </h2>
        <PhotoEditor
          value={form.images}
          onChange={(images) => patch({ images })}
        />
        <ChipPicker
          label="Equipment"
          options={EQUIPMENT_PRESETS[form.category]}
          value={form.equipment}
          onChange={(equipment) => patch({ equipment })}
        />
        <ChipPicker
          label="Amenities"
          options={AMENITIES_LIBRARY}
          value={form.amenities}
          onChange={(amenities) => patch({ amenities })}
        />
      </section>

      {/* Availability */}
      <section className="flex flex-col gap-6" aria-labelledby="edit-availability">
        <h2 id="edit-availability" className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
          Availability
        </h2>
        <WeeklyHoursEditor
          value={form.weeklyHours as WeeklyHours}
          onChange={(weeklyHours) => patch({ weeklyHours })}
        />
        <UnavailableDatesEditor
          value={form.unavailableDates}
          onChange={(unavailableDates) => patch({ unavailableDates })}
        />
        <Field
          label="Book-ahead window"
          htmlFor="e-window"
          hint="How far ahead creators can request times."
        >
          <Select
            value={String(form.advanceWindowDays)}
            onValueChange={(v) => patch({ advanceWindowDays: Number(v) })}
          >
            <SelectTrigger id="e-window" className="max-w-xs" aria-label="Book-ahead window">
              {form.advanceWindowDays <= 14 ? "2 weeks ahead" : form.advanceWindowDays <= 30 ? "1 month ahead" : "2 months ahead"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14">2 weeks ahead</SelectItem>
              <SelectItem value="30">1 month ahead</SelectItem>
              <SelectItem value="60">2 months ahead</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-6">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/my-listings">Back to My Listings</Link>
        </Button>
      </div>
    </form>
  );
}

function seedForm(listing: OwnedStudio): Editable {
  return {
    name: listing.name,
    category: listing.category,
    area: listing.area,
    city: listing.city,
    address: listing.address,
    tagline: listing.tagline,
    description: listing.description,
    capacity: listing.capacity,
    sizeSqft: listing.sizeSqft,
    hourlyRate: listing.hourlyRate,
    securityDeposit: listing.securityDeposit,
    minHours: listing.minHours,
    maxHours: listing.maxHours,
    cancellationPolicy: listing.cancellationPolicy,
    images: [...listing.images],
    equipment: [...listing.equipment],
    amenities: [...listing.amenities],
    weeklyHours: { ...listing.weeklyHours },
    unavailableDates: [...listing.unavailableDates],
    advanceWindowDays: listing.advanceWindowDays,
  };
}

function PhotoEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [customUrl, setCustomUrl] = useState("");

  const remove = (url: string) => {
    if (value.length === 1) {
      toast("Keep at least one photo", {
        description: "Add a replacement first, then remove this one.",
      });
      return;
    }
    onChange(value.filter((v) => v !== url));
  };

  const addSample = (url: string) => {
    if (value.includes(url)) return;
    onChange([...value, url]);
  };

  const addCustom = () => {
    const url = customUrl.trim();
    if (!url || !/^https?:\/\//.test(url) || value.includes(url)) return;
    onChange([...value, url]);
    setCustomUrl("");
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-[13px] font-medium text-neutral-800">Photos</p>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <figure
            key={url}
            className="m-0 relative aspect-[4/3] w-32 overflow-hidden rounded-sm border bg-neutral-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${url}&w=480`} alt={`Photo ${i + 1}`} className="absolute inset-0 size-full object-cover" />
            {i === 0 ? (
              <figcaption className="absolute bottom-1.5 left-1.5 rounded-xs bg-neutral-950/85 px-1.5 py-0.5 text-[11px] font-semibold text-brand-canvas">
                Cover
              </figcaption>
            ) : null}
            <button
              type="button"
              onClick={() => remove(url)}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-neutral-50/90 text-neutral-900 transition-colors hover:bg-error hover:text-brand-canvas"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </figure>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] text-neutral-600">Add from the sample library:</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sample library additions">
          {SAMPLE_ADDITIONS.filter((u) => !value.includes(u)).map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => addSample(url)}
              className="flex size-12 items-center justify-center overflow-hidden rounded-sm border border-neutral-300 bg-neutral-50 transition-colors hover:border-neutral-950"
              aria-label="Add sample photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${url}&w=160`} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://image-link..."
            className="max-w-sm"
            aria-label="Custom image URL"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addCustom}
            disabled={!customUrl.trim() || !/^https?:\/\//.test(customUrl.trim())}
          >
            <ImageIcon className="size-4" aria-hidden />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

function NoPermission() {
  return (
    <div className="flex flex-col items-start gap-5 rounded-md border border-dashed border-neutral-300 bg-neutral-100/60 px-8 py-14">
      <div>
        <p className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
          You don&rsquo;t have permission to edit this listing.
        </p>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-600">
          Only the studio&rsquo;s host can make changes. If this is your room,
          log in with the account that listed it.
        </p>
      </div>
      <Button asChild variant="secondary">
        <Link href="/my-listings">Back to My Listings</Link>
      </Button>
    </div>
  );
}
