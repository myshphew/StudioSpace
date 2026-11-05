import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow, PageHeader, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works — StudioSpace",
  description:
    "From browsing spaces to sending a booking request, and from listing your studio to managing incoming requests.",
};

export default function HowItWorksPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="How it works"
        title="Simple from both sides of the space."
        description="StudioSpace connects creators looking for a place to make things with studio owners opening their doors. Here's exactly what happens — no fine print required."
      />

      {/* Creator flow */}
      <Reveal className="mt-24">
        <SectionHeading
          eyebrow="For creators"
          title="Book a space. Make your thing."
          description="Four steps between spotting a studio and walking through its door."
        />
      </Reveal>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
        {CREATOR_STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 60} className="h-full">
            <div className="flex h-full flex-col gap-6 bg-neutral-50 p-6 sm:p-8">
              <p className="font-display text-6xl font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--color-neutral-300)]">
                {step.n}
              </p>
              <div className="flex flex-col gap-2">
                <p className="font-display text-xl font-bold tracking-[-0.025em] text-neutral-950">
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed text-neutral-700">{step.copy}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-10">
        <div className="flex flex-col gap-4 rounded-md bg-warning-soft p-6 sm:flex-row sm:items-start sm:gap-6">
          <span className="eyebrow shrink-0 text-warning">Good to know</span>
          <div className="max-w-3xl flex flex-col gap-3 text-sm leading-relaxed text-neutral-800">
            <p>
              <strong>A request is not a confirmation.</strong> Every booking starts as
              a request. The host reviews it and confirms — only then is your time
              reserved. If it can&rsquo;t fit, the host declines and you&rsquo;ll have
              that request open to rebook elsewhere.
            </p>
            <p>
              <strong>Payments are arranged directly with the host.</strong> StudioSpace
              doesn&rsquo;t charge or process your money at this stage. You and the host
              settle fees and any security deposit between yourselves.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Host flow */}
      <Reveal className="mt-24">
        <SectionHeading
          eyebrow="For hosts"
          title="Share your space. Keep control."
          description="Your studio stays yours — you decide who gets in and when."
        />
      </Reveal>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
        {HOST_STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 60} className="h-full">
            <div className="flex h-full flex-col gap-6 bg-neutral-50 p-6 sm:p-8">
              <p className="font-display text-6xl font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--color-neutral-300)]">
                {step.n}
              </p>
              <div className="flex flex-col gap-2">
                <p className="font-display text-xl font-bold tracking-[-0.025em] text-neutral-950">
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed text-neutral-700">{step.copy}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      {/* What you always control */}
      <Reveal className="mt-24">
        <div className="grid gap-10 rounded-xl border border-neutral-200 bg-neutral-50 p-8 sm:p-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow>Always in your hands</Eyebrow>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950">
              Approve, decline, reschedule — your call.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-neutral-700">
              Creators send requests with the details in plain sight. You see the
              date, the time, and the message before anything is confirmed.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {CONTROL_POINTS.map(c => (
              <div key={c.title} className="flex flex-col gap-1.5 border-l-2 border-brand-orange pl-5">
                <p className="text-sm font-semibold text-neutral-950">{c.title}</p>
                <p className="text-sm leading-relaxed text-neutral-700">{c.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Where to go next */}
      <Reveal as="section" className="mt-24 flex flex-col items-start gap-6 border-y border-neutral-200 py-20">
        <Eyebrow>Where to next</Eyebrow>
        <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-5xl">
          Take the tour, then book your first session.
        </h2>
        <p className="max-w-md text-base text-neutral-700">
          Browse the spaces that are open right now, or see what it takes to list
          your own.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/studios">
              Explore Studios
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/add-studio">List Your Space</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

const CREATOR_STEPS = [
  {
    n: "01",
    title: "Browse",
    copy: "Filter by neighbourhood, category, capacity or hourly rate — then look inside every space with photos, equipment lists and host notes.",
  },
  {
    n: "02",
    title: "Pick your time",
    copy: "Check the studio's weekly hours and open dates, then use the calendar to pick a start time that suits your project.",
  },
  {
    n: "03",
    title: "Send a request",
    copy: "Tell the host what you're making and when. Your request stays pending until the host looks at it.",
  },
  {
    n: "04",
    title: "Confirm and create",
    copy: "Once the host approves, your session is set. Settle any fees directly with them and show up ready to work.",
  },
];

const HOST_STEPS = [
  {
    n: "01",
    title: "List",
    copy: "Add your studio step by step — the basics, pricing, photos, equipment and the hours it's available.",
  },
  {
    n: "02",
    title: "Review requests",
    copy: "Requests show up in your list with the creator's message and preferred slot. Nothing is confirmed without you.",
  },
  {
    n: "03",
    title: "Approve or decline",
    copy: "One tap to confirm a booking and lock the slot, or to pass and let the creator explore other spaces.",
  },
  {
    n: "04",
    title: "Meet your creators",
    copy: "Deal directly with creators for payment and session details — many turn once-off bookings into regular clients.",
  },
];

const CONTROL_POINTS = [
  {
    title: "Availability lives in one place",
    copy: "Set weekly opening hours and block out specific dates. The calendar shown to creators always mirrors it.",
  },
  {
    title: "Approvals keep bookings honest",
    copy: "Two requests for the same slot can't both be approved — the first confirmation wins, and the second accept is stopped.",
  },
  {
    title: "Cancellations follow your policy",
    copy: "Publish your cancellation policy on the listing — flexible, moderate or strict — so creators know it before they request.",
  },
  {
    title: "Pause whenever you need to",
    copy: "Take the listing off the market without deleting it. Paused spaces stop accepting new requests and come back when you're ready.",
  },
];
