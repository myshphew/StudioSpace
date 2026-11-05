import Link from "next/link";
import Image from "next/image";
import { Eyebrow, PageHeader, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/demo/images";

export const metadata = {
  title: "About — StudioSpace",
  description:
    "StudioSpace is a peer-to-peer creative workspace marketplace, started in Dhaka to put inspiring, bookable spaces within reach of every creator.",
};

export default function AboutPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="About us"
        title="Built on the idea that great work needs a place to happen."
        description="StudioSpace is a marketplace where creators find inspiring, bookable production spaces — and studio owners turn their space into an opportunity."
      />

      <Reveal className="mt-20">
        <div className="relative flex aspect-[16/9] items-end overflow-hidden rounded-xl border border-neutral-200 sm:aspect-[2/1]">
          <Image
            src={IMG.photographerStreet}
            alt="A photographer working with lights in a bright studio"
            fill
            sizes="(min-width: 1280px) 72vw, 92vw"
            className="object-cover"
          />
          <figcaption className="m-5 rounded-sm bg-neutral-50/90 px-3 py-2 text-xs backdrop-blur sm:m-8">
            Every project starts somewhere.
          </figcaption>
        </div>
      </Reveal>

      {/* Story */}
      <Reveal as="section" className="mt-24 grid gap-10 lg:grid-cols-3 lg:gap-16">
        <Eyebrow className="pt-1">Our story</Eyebrow>
        <div className="max-w-2xl flex flex-col gap-5 text-lg leading-relaxed text-neutral-800 lg:col-span-2">
          <p>
            StudioSpace started from an obvious frustration: the creative work in
            this city was everywhere, but the spaces for it were hard to find.
            Great rooms — a daylight loft, a purpose-built cyclorama, a
            soundproofed podcast corner — sat quiet between bookings while
            creators settled for cafés and spare rooms.
          </p>
          <p>
            So we built the directory we wished existed. One place where studio
            owners show their space honestly — photos, hours, equipment, rules —
            and creators can compare, choose and send a booking request without
            ten phone calls.
          </p>
          <p>
            We started in Dhaka, where finding a studio often still means word of
            mouth and a chain of DMs. If it works here, it works anywhere clubs,
            collectives and small crews make things under the same pressure.
          </p>
        </div>
      </Reveal>

      {/* Values */}
      <Reveal className="mt-24">
        <SectionHeading
          eyebrow="What we believe"
          title="Four things we refuse to compromise."
        />
      </Reveal>
      <dl className="mt-12 grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 60} className="h-full">
            <div className="flex h-full flex-col gap-3 bg-neutral-50 p-8 sm:p-10">
              <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
              <dt className="font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
                {v.title}
              </dt>
              <dd className="max-w-md text-sm leading-relaxed text-neutral-700">
                {v.copy}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>

      {/* Numbers band */}
      <Reveal as="section" className="mt-24">
        <div className="dark-section rounded-xl bg-neutral-950 px-8 py-14 text-brand-canvas sm:px-12">
          <Eyebrow className="!text-neutral-400">Where we are today</Eyebrow>
          <dl className="mt-10 grid gap-10 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <dt className="text-sm text-neutral-400">{s.label}</dt>
                <dd className="font-display text-6xl font-black tracking-[-0.05em] sm:text-7xl">
                  {s.value}
                </dd>
                <span className="text-sm max-w-xs text-neutral-500">{s.note}</span>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-400">
            This build is a design preview, so every listing, booking and review
            you see is fictional sample data. The flows they demo are the ones
            we&rsquo;re shipping.
          </p>
        </div>
      </Reveal>

      {/* Markets */}
      <Reveal as="section" className="mt-24 grid gap-10 lg:grid-cols-3 lg:gap-16">
        <Eyebrow className="pt-1">The deliberate part</Eyebrow>
        <div className="max-w-2xl flex flex-col gap-5 text-base leading-relaxed text-neutral-700 lg:col-span-2">
          <p>
            We&rsquo;d rather go deep than wide. One city, every neighbourhood in
            it, every kind of space — photography, film, music, podcasts, art.
            When you search, the results should be real: hours you can book,
            gear that&rsquo;s actually there, hosts who actually respond.
          </p>
          <p>
            And because bookings are reviewed by hosts, both sides deal with a
            person, not just a system. That&rsquo;s the part we never want to
            smooth away.
          </p>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal as="section" className="mt-24 flex flex-col items-center gap-5 border-y border-neutral-200 py-20 text-center sm:py-24">
        <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-6xl">
          Come make something with us.
        </h2>
        <p className="max-w-md text-base text-neutral-700">
          Whether you&rsquo;re looking for a space or opening one, StudioSpace
          works best when you do.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/studios">Explore Studios</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

const VALUES = [
  {
    title: "Direct and honest",
    copy: "Listings show the real space — the good light and the tight corners. Booking happens between people, and details stay in plain sight from request to confirmation.",
  },
  {
    title: "Creators set the agenda",
    copy: "We build around the session: short lead times, flexible durations, no shiny upsells on the way to the calendar.",
  },
  {
    title: "Hosts keep the upper hand on their home turf",
    copy: "No booking happens without the host's approval. Set your hours, your policies and your pace — it's your space first.",
  },
  {
    title: "Small is a feature",
    copy: "One-person shoots and two-hour podcast sessions are as welcome as full production days. Every listing says its minimum so no one's guessing.",
  },
];

const STATS = [
  {
    label: "Creative spaces on the map",
    value: "2,400+",
    note: "From single-room pods to full production studios — our long-term goal for the first city.",
  },
  {
    label: "Creative categories",
    value: "5",
    note: "Photography, film, podcast, music and art — with cross-over rooms in plenty.",
  },
  {
    label: "Hello emails replied to",
    value: "1",
    note: "Ours. Write to us and we'll keep the streak going.",
  },
];
