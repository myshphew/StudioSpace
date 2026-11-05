import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Studio } from "@/lib/types";
import { CATEGORY_META, CANCELLATION_POLICY_LABEL } from "@/lib/constants";
import { formatBDT } from "@/lib/format";
import { reviewsForStudio } from "@/lib/demo/studios";
import { Gallery } from "@/components/studio/gallery";
import { BookingPanel } from "@/components/booking/booking-panel";
import { SimilarStudios } from "@/components/studio/similar-studios";
import { FavoriteButton } from "@/components/studio/favorite-button";
import { StarRow } from "@/components/status";
import { Reveal } from "@/components/reveal";

/**
 * Full studio details. Server-rendered for seed listings; the same tree is
 * reused client-side for listings saved in the demo store.
 */
export function StudioDetailContent({ studio }: { studio: Studio }) {
  const meta = CATEGORY_META[studio.category];
  const specs = [
    { label: "Studio type", value: meta.label },
    { label: "Capacity", value: `Up to ${studio.capacity} people` },
    { label: "Size", value: `${studio.sizeSqft.toLocaleString()} sq. ft.` },
    { label: "Minimum booking", value: `${studio.minHours} hours` },
    { label: "Hourly rate", value: `${formatBDT(studio.hourlyRate)}` },
    { label: "Security deposit", value: `${formatBDT(studio.securityDeposit)}` },
  ];
  const reviews = reviewsForStudio(studio.id);

  const weeklyRows = (
    <table>
      <caption className="sr-only">Weekly opening hours</caption>
      <tbody>
        {openDays(studio).map((day) => (
          <tr key={day.day} className="flex justify-between gap-4 py-0.5">
            <td className="text-neutral-600">{day.day}</td>
            <td className="font-medium text-neutral-950">
              {day.open}–{day.close}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="pt-6">
        <nav aria-label="Breadcrumb" className="text-[13px] text-neutral-600">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-neutral-950 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/studios" className="hover:text-neutral-950 hover:underline">
                Studios
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>{meta.label}</li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-medium text-neutral-950">
              {studio.name}
            </li>
          </ol>
        </nav>
      </div>

      <article className="container-page pb-24">
        <SectionBlock>
          {/* Title block */}
          <Reveal className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-xs bg-neutral-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                    {meta.label}
                  </span>
                  {studio.status !== "active" ? (
                    <span className="rounded-xs bg-warning-soft px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warning">
                      {studio.status === "draft"
                        ? "Draft listing"
                        : studio.status === "paused"
                          ? "Paused — not accepting new bookings"
                          : "Archived"}
                    </span>
                  ) : null}
                </div>
                <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-neutral-950 sm:text-6xl">
                  {studio.name}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-neutral-700">
                  {studio.tagline}
                </p>
              </div>
              <div className="hidden shrink-0 sm:block">
                <FavoriteButton studioId={studio.id} studioName={studio.name} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-700">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-neutral-500" aria-hidden />
                {studio.area}, {studio.city}, Bangladesh
              </span>
              {studio.rating > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-neutral-950">
                    {studio.rating.toFixed(1)}
                  </span>
                  <span>({studio.reviewCount} reviews)</span>
                </span>
              ) : (
                <span className="text-neutral-500">No reviews yet</span>
              )}
            </div>
          </Reveal>

          <Gallery images={studio.images} studioName={studio.name} />
        </SectionBlock>

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          {/* Left column */}
          <div className="flex min-w-0 flex-col gap-16">
            <SectionBlock>
              <section aria-labelledby="about-heading" className="flex flex-col gap-5">
                <h2 id="about-heading" className="font-display text-3xl font-bold tracking-[-0.035em] text-neutral-950">
                  A blank canvas for your best ideas.
                </h2>
                <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-neutral-700">
                  {studio.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <div className="mt-2">
                  <h3 className="text-[15px] font-semibold text-neutral-950">
                    What makes this space special?
                  </h3>
                  <ul className="mt-3 flex max-w-2xl flex-col gap-2 text-sm text-neutral-700">
                    {studio.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </SectionBlock>

            <SectionBlock>
              <section aria-labelledby="specs-heading" className="flex flex-col gap-6">
                <h2 id="specs-heading" className="font-display text-3xl font-bold tracking-[-0.035em] text-neutral-950">
                  The space at a glance.
                </h2>
                <dl className="grid max-w-2xl gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between gap-4 bg-neutral-50 px-5 py-4">
                      <dt className="text-sm text-neutral-600">{spec.label}</dt>
                      <dd className="text-sm font-semibold text-neutral-950">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
                  {CANCELLATION_POLICY_LABEL[studio.cancellationPolicy]}
                </p>
              </section>
            </SectionBlock>

            <SectionBlock>
              <section aria-labelledby="equipment-heading" className="flex flex-col gap-6">
                <h2 id="equipment-heading" className="font-display text-3xl font-bold tracking-[-0.035em] text-neutral-950">
                  Everything you need to get started.
                </h2>
                <div className="flex max-w-2xl flex-col gap-6">
                  <ChipRows label="Equipment" items={studio.equipment} />
                  <ChipRows label="Amenities" items={studio.amenities} />
                </div>
              </section>
            </SectionBlock>

            <SectionBlock>
              <section aria-labelledby="host-heading" className="flex flex-col gap-6">
                <h2 id="host-heading" className="font-display text-3xl font-bold tracking-[-0.035em] text-neutral-950">
                  Meet your host.
                </h2>
                <div className="flex max-w-2xl items-start gap-5">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-display text-lg font-bold text-brand-canvas">
                    {initials(studio.host.name)}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-display text-lg font-bold tracking-[-0.02em] text-neutral-950">
                      {studio.host.name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Studio owner · Member since {studio.host.memberSince}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                      {studio.host.bio}
                    </p>
                  </div>
                </div>
              </section>
            </SectionBlock>

            <SectionBlock>
              <section aria-labelledby="availability-heading" className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h2 id="availability-heading" className="font-display text-3xl font-bold tracking-[-0.035em] text-neutral-950">
                    Find a time that works.
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-neutral-700">
                    Choose your preferred date and time in the booking panel to
                    send a request. Your reservation is confirmed once the host
                    approves it.
                  </p>
                </div>
                <div className="grid max-w-xl gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      Weekly opening hours
                    </p>
                    {weeklyRows}
                  </div>
                  <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      Unavailable dates
                    </p>
                    {studio.unavailableDates.length === 0 ? (
                      <p className="text-neutral-700">Only closed weekdays listed.</p>
                    ) : (
                      <ul className="flex flex-col gap-1 text-neutral-700">
                        {studio.unavailableDates.slice(0, 5).map((d) => (
                          <li key={d}>{prettyDate(d)}</li>
                        ))}
                        {studio.unavailableDates.length > 5 ? (
                          <li className="text-neutral-500">And {studio.unavailableDates.length - 5} more dates…</li>
                        ) : null}
                      </ul>
                    )}
                    <p className="mt-3 text-xs text-neutral-600">
                      Up to {studio.advanceWindowDays} days ahead.
                    </p>
                  </div>
                </div>
              </section>
            </SectionBlock>

            {reviews.length > 0 ? (
              <SectionBlock>
                <section aria-labelledby="reviews-heading" className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h2 id="reviews-heading" className="font-display text-3xl font-bold tracking-[-0.035em] text-neutral-950">
                      Creators have been here.
                    </h2>
                    <p className="max-w-xl text-sm text-neutral-700">
                      Sample experiences from demo bookings — shown for design
                      review, presented as fictional content.
                    </p>
                  </div>
                  <ul className="flex flex-col gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200">
                    {reviews.map((r) => (
                      <li key={r.id} className="flex flex-col gap-3 bg-neutral-50 p-5 sm:p-6">
                        <StarRow value={r.rating} />
                        <blockquote className="max-w-2xl text-[15px] leading-relaxed text-neutral-800">
                          “{r.text}”
                        </blockquote>
                        <p className="text-sm text-neutral-600">
                          <span className="font-semibold text-neutral-950">{r.author}</span>
                          {" · "}
                          {r.context} · {r.date}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </SectionBlock>
            ) : null}
          </div>

          {/* Right rail */}
          <div>
            <div className="lg:sticky lg:top-28">
              <BookingPanel
                studio={studio}
                weeklyHours={weeklyRows}
                unavailableDates={studio.unavailableDates}
              />
            </div>
          </div>
        </div>
      </article>

      <SectionBlock>
        <SimilarStudios studio={studio} />
      </SectionBlock>
    </>
  );
}

function SectionBlock({ children }: { children: React.ReactNode }) {
  return <div className="container-page">{children}</div>;
}

function ChipRows({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        {label}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[13px] text-neutral-800"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function openDays(studio: Studio) {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const rows: Array<{ day: string; open: string; close: string }> = [];
  for (const [dayStr, hours] of Object.entries(studio.weeklyHours)) {
    const idx = Number(dayStr);
    if (!hours) continue;
    rows.push({ day: names[idx], open: fmtTime(hours.open), close: fmtTime(hours.close) });
  }
  const ordered = [1, 2, 3, 4, 5, 6, 0];
  return rows.sort((a, b) => ordered.indexOf(names.indexOf(a.day)) - ordered.indexOf(names.indexOf(b.day)));
}

function fmtTime(hhmm: string) {
  const [h] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour} ${suffix}`;
}

function prettyDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
