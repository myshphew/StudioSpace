"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ImageIcon } from "lucide-react";
import type { Studio, StudioCategory, CancellationPolicy, WeeklyHours } from "@/lib/types";
import { AMENITIES_LIBRARY, CATEGORY_META, CATEGORY_ORDER, EQUIPMENT_PRESETS } from "@/lib/constants";
import { IMG } from "@/lib/demo/images";
import { useSession } from "@/lib/auth/session";
import * as store from "@/lib/demo/store";
import { formatBDT } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ChipPicker } from "@/components/host/chip-picker";
import { WeeklyHoursEditor } from "@/components/host/weekly-hours-editor";
import { UnavailableDatesEditor } from "@/components/host/unavailable-dates-editor";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "The basics", blurb: "Name, space and the first impression." },
  { title: "Pricing", blurb: "Hourly rate, deposit and booking rules." },
  { title: "Photos & gear", blurb: "Show the space and what's in it." },
  { title: "Availability", blurb: "When creators can book." },
  { title: "Review & publish", blurb: "Last look before it goes live." },
] as const;

interface WizardState {
  name: string;
  category: StudioCategory;
  city: string;
  area: string;
  address: string;
  tagline: string;
  description: string;
  capacity: string;
  sizeSqft: string;
  hourlyRate: string;
  securityDeposit: string;
  minHours: string;
  maxHours: string;
  cancellationPolicy: CancellationPolicy;
  images: string[];
  equipment: string[];
  amenities: string[];
  weeklyHours: WeeklyHours;
  unavailableDates: string[];
  advanceWindowDays: string;
}

function defaultWeeklyHours(): WeeklyHours {
  return {
    0: null,
    1: { open: "10:00", close: "20:00" },
    2: { open: "10:00", close: "20:00" },
    3: { open: "10:00", close: "20:00" },
    4: { open: "10:00", close: "20:00" },
    5: { open: "10:00", close: "20:00" },
    6: { open: "11:00", close: "19:00" },
  };
}

function initialState(): WizardState {
  return {
    name: "",
    category: "photography",
    city: "Dhaka",
    area: "",
    address: "",
    tagline: "",
    description: "",
    capacity: "5",
    sizeSqft: "500",
    hourlyRate: "1500",
    securityDeposit: "1000",
    minHours: "2",
    maxHours: "8",
    cancellationPolicy: "moderate",
    images: [],
    equipment: [...EQUIPMENT_PRESETS.photography.slice(0, 3)],
    amenities: ["Wi-Fi", "Air conditioning"],
    weeklyHours: defaultWeeklyHours(),
    unavailableDates: [],
    advanceWindowDays: "60",
  };
}

/** Verified sample photography the host can drop in while the flow is a demo. */
const SAMPLE_POOL = [
  IMG.photoStudioCyc,
  IMG.cameraFlatlay,
  IMG.canonDslr,
  IMG.whiteDaylight,
  IMG.loungeSofa,
  IMG.glassCorridor,
  IMG.stageMic,
  IMG.condenserMic,
  IMG.sm7bDark,
  IMG.musicRoomGuitars,
  IMG.rehearsalRoom,
  IMG.headphones,
  IMG.clapperboard,
  IMG.filmCamera,
  IMG.photographerStreet,
  IMG.neonCorridor,
  IMG.painterDesk,
  IMG.galleryWall,
  IMG.moroccanInterior,
  IMG.auditorium,
];

const num = (s: string) => Number(s || "0");

function durationLabel(h: number) {
  return `${h} ${h === 1 ? "hour" : "hours"}`;
}

function policyLabel(policy: CancellationPolicy) {
  return policy === "flexible"
    ? "Flexible — free up to 24 hours before"
    : policy === "moderate"
      ? "Moderate — free up to 3 days before"
      : "Strict — reviewed case by case";
}

export function AddStudioWizard() {
  const { user, ready } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardState>(initialState);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const patch = (p: Partial<WizardState>) => setForm((f) => ({ ...f, ...p }));

  const validateStep = (index: number): Record<string, string> => {
    switch (index) {
      case 0: {
        const errors: Record<string, string> = {};
        if (!form.name.trim()) errors.name = "Give your studio a name creators can find.";
        if (!form.area.trim()) errors.area = "Creators search by area — add the neighbourhood.";
        if (!form.tagline.trim()) errors.tagline = "One sentence that sells the space.";
        if (!form.description.trim())
          errors.description = "Tell creators what the space is like to work in.";
        return errors;
      }
      case 1: {
        const errors: Record<string, string> = {};
        if (num(form.hourlyRate) < 100) errors.hourlyRate = "Hourly rate starts at ৳100.";
        if (num(form.minHours) < 1) errors.minHours = "Minimum booking is 1 hour.";
        if (num(form.maxHours) < num(form.minHours))
          errors.maxHours = "Max hours can't sit below the minimum.";
        if (num(form.securityDeposit) < 0) errors.securityDeposit = "Deposits can't be negative.";
        return errors;
      }
      case 2: {
        const errors: Record<string, string> = {};
        if (form.images.length === 0)
          errors.images = "Add at least one photo — a listing without pictures stays unseen.";
        return errors;
      }
      case 3: {
        const errors: Record<string, string> = {};
        const openDays = ([0, 1, 2, 3, 4, 5, 6] as const).filter(
          (d) => form.weeklyHours[d] !== null,
        );
        if (openDays.length === 0) errors.weeklyHours = "Open at least one day of the week.";
        for (const d of openDays) {
          const h = form.weeklyHours[d];
          if (h && h.close <= h.open) {
            errors.weeklyHours =
              "Opening time needs to come before closing time on each open day.";
            break;
          }
        }
        if (num(form.advanceWindowDays) < 7)
          errors.advanceWindowDays = "Keep at least 7 days open for planning.";
        return errors;
      }
      default:
        return {};
    }
  };

  const goNext = () => {
    const errors = validateStep(step);
    setStepErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const buildStudio = (status: "draft" | "active"): Studio => {
    const id = `own-${Math.random().toString(36).slice(2, 10)}`;
    const hostName = store.getSession().user?.name ?? "You";
    return {
      id,
      name: form.name.trim() || "Untitled studio",
      tagline: form.tagline.trim() || "A creative space waiting for its description.",
      description:
        form.description.trim() ||
        "This listing is still being written — the host will add the proper description soon.",
      highlights: [
        "Listed just now through the Add Studio flow.",
        "Details, photos and availability are up to date.",
        "The host approves every booking request personally.",
      ],
      category: form.category,
      city: form.city.trim() || "Dhaka",
      area: form.area.trim() || "Dhaka",
      address: form.address.trim() || `${form.area.trim() || "Dhaka"}, Bangladesh`,
      capacity: Math.max(1, num(form.capacity)),
      sizeSqft: Math.max(50, num(form.sizeSqft)),
      hourlyRate: Math.max(100, num(form.hourlyRate)),
      securityDeposit: Math.max(0, num(form.securityDeposit)),
      minHours: Math.max(1, num(form.minHours)),
      maxHours: Math.max(num(form.minHours) || 1, num(form.maxHours)),
      cancellationPolicy: form.cancellationPolicy,
      rating: 0,
      reviewCount: 0,
      images: form.images.length > 0 ? form.images : [SAMPLE_POOL[0]],
      equipment: form.equipment,
      amenities: form.amenities,
      weeklyHours: form.weeklyHours,
      unavailableDates: [...form.unavailableDates],
      advanceWindowDays: Math.max(7, num(form.advanceWindowDays)),
      status,
      featured: false,
      host: {
        name: hostName,
        memberSince: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        bio: "New on StudioSpace — this host just opened their room to creators.",
      },
    };
  };

  const finish = (status: "draft" | "active") => {
    if (!user) return;
    setFormError(null);
    if (status === "active") {
      for (let i = 0; i < STEPS.length - 1; i++) {
        const errors = validateStep(i);
        if (Object.keys(errors).length > 0) {
          setStep(i);
          setStepErrors(errors);
          setFormError(
            "Almost there — the highlighted step needs a little more before it can go live.",
          );
          return;
        }
      }
    }
    setStepErrors({});
    setBusy(true);
    store.createListing(buildStudio(status), user.id);
    setBusy(false);
    toast.success(
      status === "active" ? "Studio added successfully." : "Draft saved.",
      {
        description:
          status === "active"
            ? "Creators can find it and send booking requests right away."
            : "Finish the details whenever you're ready — drafts stay private.",
      },
    );
    router.push("/my-listings");
  };

  if (!ready) return <WizardSkeleton />;

  return (
    <div className="flex flex-col gap-10">
      {/* Stepper */}
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-0" aria-label="Add studio steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3 sm:flex-1">
            <button
              type="button"
              onClick={() => setStep(i)}
              className="flex items-center gap-2.5 rounded-sm py-1 pr-2 text-left"
              aria-current={i === step ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  i < step && "border-neutral-950 bg-neutral-950 text-brand-canvas",
                  i === step && "border-brand-orange bg-brand-orange text-brand-charcoal",
                  i > step && "border-neutral-300 text-neutral-600",
                )}
                aria-hidden
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className="flex flex-col leading-tight">
                <span
                  className={cn(
                    "text-[13px] font-semibold",
                    i === step ? "text-neutral-950" : "text-neutral-600",
                  )}
                >
                  {s.title}
                </span>
                <span className="hidden text-[11px] text-neutral-500 xl:block">{s.blurb}</span>
              </span>
            </button>
            {i < STEPS.length - 1 ? (
              <span className="mt-4 h-px flex-1 bg-neutral-200" aria-hidden />
            ) : null}
          </li>
        ))}
      </ol>

      {formError ? (
        <p className="rounded-sm bg-error-soft px-4 py-3 text-sm text-error" role="alert">
          {formError}
        </p>
      ) : null}

      {step === 0 ? <BasicsStep form={form} patch={patch} errors={stepErrors} /> : null}
      {step === 1 ? <PricingStep form={form} patch={patch} errors={stepErrors} /> : null}
      {step === 2 ? <PhotosStep form={form} patch={patch} errors={stepErrors} /> : null}
      {step === 3 ? <AvailabilityStep form={form} patch={patch} errors={stepErrors} /> : null}
      {step === 4 ? <ReviewStep form={form} /> : null}

      <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || busy}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={goNext} disabled={busy}>
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="secondary" onClick={() => finish("draft")} disabled={busy}>
            Save as Draft
          </Button>
          {step === STEPS.length - 1 ? (
            <Button onClick={() => finish("active")} disabled={busy}>
              {busy ? "Publishing..." : "Publish Listing"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WizardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="skeleton h-10 w-full max-w-xl" />
      <div className="skeleton h-64 w-full" />
      <div className="skeleton h-12 w-full max-w-2xl" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* steps                                                               */
/* ------------------------------------------------------------------ */

type Errors = Record<string, string>;

function BasicsStep({
  form,
  patch,
  errors,
}: {
  form: WizardState;
  patch: (p: Partial<WizardState>) => void;
  errors: Errors;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Studio name" htmlFor="w-name" required error={errors.name} className="sm:col-span-2">
        <Input
          id="w-name"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="e.g. North Light Loft"
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <Field label="Studio category" htmlFor="w-category" required>
        <Select value={form.category} onValueChange={(v) => patch({ category: v as StudioCategory })}>
          <SelectTrigger id="w-category" aria-label="Studio category">
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

      <Field label="Capacity" htmlFor="w-capacity" hint="Guests you're happy to host at once.">
        <div className="flex items-center gap-2">
          <Input
            id="w-capacity"
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => patch({ capacity: e.target.value })}
          />
          <span className="shrink-0 text-sm text-neutral-600">people</span>
        </div>
      </Field>

      <Field label="City" htmlFor="w-city">
        <Input
          id="w-city"
          value={form.city}
          onChange={(e) => patch({ city: e.target.value })}
          placeholder="Dhaka"
        />
      </Field>

      <Field label="Area / neighbourhood" htmlFor="w-area" required error={errors.area}>
        <Input
          id="w-area"
          value={form.area}
          onChange={(e) => patch({ area: e.target.value })}
          placeholder="e.g. Banani"
          aria-invalid={Boolean(errors.area)}
        />
      </Field>

      <Field label="Size" htmlFor="w-size" hint="Roughly — square feet of the working area.">
        <div className="flex items-center gap-2">
          <Input
            id="w-size"
            type="number"
            min={50}
            value={form.sizeSqft}
            onChange={(e) => patch({ sizeSqft: e.target.value })}
          />
          <span className="shrink-0 text-sm text-neutral-600">sq. ft.</span>
        </div>
      </Field>

      <Field
        label="Full address"
        htmlFor="w-address"
        className="sm:col-span-2"
        hint="Street address — shared with a creator only after their booking is approved."
      >
        <Input
          id="w-address"
          value={form.address}
          onChange={(e) => patch({ address: e.target.value })}
          placeholder="Road, area, city and postcode"
        />
      </Field>

      <Field
        label="One-line tagline"
        htmlFor="w-tagline"
        required
        error={errors.tagline}
        className="sm:col-span-2"
      >
        <Input
          id="w-tagline"
          value={form.tagline}
          onChange={(e) => patch({ tagline: e.target.value })}
          placeholder="A bright corner studio for portraits and content days."
          aria-invalid={Boolean(errors.tagline)}
        />
      </Field>

      <Field
        label="Describe your space"
        htmlFor="w-desc"
        required
        error={errors.description}
        className="sm:col-span-2"
        hint="Separate paragraphs with a blank line — light, layout, then what makes a session here good."
      >
        <Textarea
          id="w-desc"
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="Start with the room: its size, light and mood. Then equipment, then practicalities like access, parking and the closest landmark..."
          className="min-h-32"
          aria-invalid={Boolean(errors.description)}
        />
      </Field>
    </div>
  );
}

function PricingStep({
  form,
  patch,
  errors,
}: {
  form: WizardState;
  patch: (p: Partial<WizardState>) => void;
  errors: Errors;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Hourly rate" htmlFor="w-rate" required error={errors.hourlyRate}>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
            ৳
          </span>
          <Input
            id="w-rate"
            type="number"
            min={100}
            className="pl-9"
            value={form.hourlyRate}
            onChange={(e) => patch({ hourlyRate: e.target.value })}
            aria-invalid={Boolean(errors.hourlyRate)}
          />
        </div>
      </Field>

      <Field
        label="Security deposit"
        htmlFor="w-deposit"
        hint="Refundable — shown separately on every booking. Optional."
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
            ৳
          </span>
          <Input
            id="w-deposit"
            type="number"
            min={0}
            className="pl-9"
            value={form.securityDeposit}
            onChange={(e) => patch({ securityDeposit: e.target.value })}
          />
        </div>
      </Field>

      <Field label="Minimum booking" htmlFor="w-min-hours" required error={errors.minHours}>
        <Select value={form.minHours} onValueChange={(v) => patch({ minHours: v })}>
          <SelectTrigger id="w-min-hours" aria-label="Minimum booking">
            {durationLabel(Number(form.minHours))}
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <SelectItem key={h} value={String(h)}>
                {durationLabel(h)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Maximum booking" htmlFor="w-max-hours" required error={errors.maxHours}>
        <Select value={form.maxHours} onValueChange={(v) => patch({ maxHours: v })}>
          <SelectTrigger id="w-max-hours" aria-label="Maximum booking">
            {durationLabel(Number(form.maxHours))}
          </SelectTrigger>
          <SelectContent>
            {[2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
              <SelectItem key={h} value={String(h)}>
                {durationLabel(h)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        label="Cancellation policy"
        htmlFor="w-cancel"
        className="sm:col-span-2"
        hint="Shown on the listing so creators know the terms before requesting."
      >
        <Select
          value={form.cancellationPolicy}
          onValueChange={(v) => patch({ cancellationPolicy: v as CancellationPolicy })}
        >
          <SelectTrigger id="w-cancel" aria-label="Cancellation policy">
            {policyLabel(form.cancellationPolicy)}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flexible">Flexible — free up to 24 hours before</SelectItem>
            <SelectItem value="moderate">Moderate — free up to 3 days before</SelectItem>
            <SelectItem value="strict">Strict — reviewed case by case</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <p className="text-sm leading-relaxed text-neutral-600 sm:col-span-2">
        In this build, payment is settled directly with the host — StudioSpace
        never moves money for a session.
      </p>
    </div>
  );
}

function PhotosStep({
  form,
  patch,
  errors,
}: {
  form: WizardState;
  patch: (p: Partial<WizardState>) => void;
  errors: Errors;
}) {
  const [customUrl, setCustomUrl] = useState("");

  const toggleImage = (url: string) => {
    patch({
      images: form.images.includes(url)
        ? form.images.filter((i) => i !== url)
        : [...form.images, url],
    });
  };

  const addCustom = () => {
    const url = customUrl.trim();
    if (!url || form.images.includes(url)) return;
    if (!/^https?:\/\//.test(url)) return;
    patch({ images: [...form.images, url] });
    setCustomUrl("");
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-medium text-neutral-800">Photos</p>
          <p className="text-[13px] text-neutral-600">
            Pick from the sample library or paste a direct image URL — your
            first choice becomes the cover.
          </p>
        </div>

        {errors.images ? (
          <p className="text-[13px] text-error" aria-live="polite">
            {errors.images}
          </p>
        ) : null}

        <div
          className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3"
          role="group"
          aria-label="Sample photo library"
        >
          {SAMPLE_POOL.map((url) => {
            const active = form.images.includes(url);
            const order = form.images.indexOf(url) + 1;
            return (
              <button
                key={url}
                type="button"
                onClick={() => toggleImage(url)}
                aria-pressed={active}
                aria-label={active ? `Remove photo${order > 1 ? ` ${order}` : ""}` : "Add photo"}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-sm border bg-neutral-100",
                  active
                    ? "border-neutral-950 ring-2 ring-neutral-950"
                    : "border-transparent hover:border-neutral-400",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${url}&w=480`}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  loading="lazy"
                />
                {active ? (
                  <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-neutral-950 text-brand-canvas">
                    <Check className="size-3" aria-hidden />
                  </span>
                ) : null}
                {active ? (
                  <span className="absolute bottom-1.5 left-1.5 rounded-xs bg-neutral-950/85 px-1.5 py-0.5 text-[11px] font-semibold text-brand-canvas">
                    {order === 1 ? "Cover" : order}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://your-own-image-link..."
            className="max-w-md"
            aria-label="Custom image URL"
          />
          <Button
            variant="secondary"
            onClick={addCustom}
            disabled={!customUrl.trim() || !/^https?:\/\//.test(customUrl.trim())}
          >
            <ImageIcon className="size-4" aria-hidden />
            Add image
          </Button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <ChipPicker
          label="Equipment"
          hint="What's in the room that creators can use."
          options={EQUIPMENT_PRESETS[form.category]}
          value={form.equipment}
          onChange={(next) => patch({ equipment: next })}
          inputId="w-equipment"
        />
        <ChipPicker
          label="Amenities"
          hint="The extras that make a long day easier."
          options={AMENITIES_LIBRARY}
          value={form.amenities}
          onChange={(next) => patch({ amenities: next })}
          inputId="w-amenities"
        />
      </div>
    </div>
  );
}

function AvailabilityStep({
  form,
  patch,
  errors,
}: {
  form: WizardState;
  patch: (p: Partial<WizardState>) => void;
  errors: Errors;
}) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-medium text-neutral-800">Weekly opening hours</p>
          <p className="text-[13px] text-neutral-600">
            When the space is bookable, week after week.
          </p>
        </div>
        {errors.weeklyHours ? (
          <p className="text-[13px] text-error" aria-live="polite">
            {errors.weeklyHours}
          </p>
        ) : null}
        <WeeklyHoursEditor
          value={form.weeklyHours}
          onChange={(next) => patch({ weeklyHours: next })}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-medium text-neutral-800">Dates to block</p>
          <p className="text-[13px] text-neutral-600">
            Maintenance, private shoots, holidays — everything off-calendar.
          </p>
        </div>
        <UnavailableDatesEditor
          value={form.unavailableDates}
          onChange={(next) => patch({ unavailableDates: next })}
        />
      </div>

      <Field
        label="How far ahead creators can book"
        htmlFor="w-window"
        hint="Dates beyond this window stay hidden from the calendar."
      >
        <Select
          value={form.advanceWindowDays}
          onValueChange={(v) => patch({ advanceWindowDays: v })}
        >
          <SelectTrigger id="w-window" className="max-w-xs" aria-label="Booking window">
            {form.advanceWindowDays === "14"
              ? "2 weeks ahead"
              : form.advanceWindowDays === "30"
                ? "1 month ahead"
                : "2 months ahead"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="14">2 weeks ahead</SelectItem>
            <SelectItem value="30">1 month ahead</SelectItem>
            <SelectItem value="60">2 months ahead</SelectItem>
          </SelectContent>
        </Select>
        {errors.advanceWindowDays ? (
          <p className="mt-2 text-[13px] text-error">{errors.advanceWindowDays}</p>
        ) : null}
      </Field>
    </div>
  );
}

function ReviewStep({ form }: { form: WizardState }) {
  const openDays = ([0, 1, 2, 3, 4, 5, 6] as const).filter(
    (d) => form.weeklyHours[d] !== null,
  ).length;
  const rows: Array<{ k: string; v: string }> = [
    { k: "Category", v: CATEGORY_META[form.category].label },
    { k: "Location", v: `${form.area || "—"}, ${form.city || "—"}` },
    { k: "Capacity", v: `${form.capacity || 0} people · ${form.sizeSqft || 0} sq. ft.` },
    { k: "Hourly rate", v: formatBDT(Number(form.hourlyRate || 0)) },
    { k: "Security deposit", v: formatBDT(Number(form.securityDeposit || 0)) },
    { k: "Booking length", v: `${form.minHours || 1}–${form.maxHours || 1} hours` },
    { k: "Cancellation policy", v: form.cancellationPolicy === "flexible" ? "Flexible" : form.cancellationPolicy === "moderate" ? "Moderate" : "Strict" },
    {
      k: "Availability",
      v: `${openDays} of 7 days open · books ${form.advanceWindowDays || 30} days ahead`,
    },
    { k: "Photos", v: `${form.images.length} chosen` },
    { k: "Equipment & amenities", v: `${form.equipment.length} + ${form.amenities.length} items` },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
          {form.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${form.images[0]}&w=800`}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
              No cover photo yet
            </span>
          )}
        </div>
        <p className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
          {form.name || "Untitled studio"}
        </p>
        <p className="text-sm leading-relaxed text-neutral-700">
          {form.tagline || "Add a tagline in step one."}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <dl className="grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
          {rows.map((r) => (
            <div
              key={r.k}
              className="flex items-center justify-between gap-4 bg-neutral-50 px-5 py-3.5"
            >
              <dt className="text-sm text-neutral-600">{r.k}</dt>
              <dd className="text-sm font-semibold text-neutral-950">{r.v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-neutral-700">
          {form.images[0]
            ? "Publishing makes the listing visible to creators and ready for booking requests."
            : "A cover photo is required before publishing — go back to Photos & gear."}
        </p>
      </div>
    </div>
  );
}
