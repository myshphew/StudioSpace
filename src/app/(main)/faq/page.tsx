import { Eyebrow, PageHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ — StudioSpace",
  description:
    "Answers to common questions about finding and booking creative spaces, hosting your studio, requests, approvals and payments.",
};

export default function FaqPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Frequently asked questions"
        title="Everything worth asking, answered plainly."
        description="Can't find what you're looking for? Our contact page has us on the other end."
      />

      <div className="mt-20 grid gap-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
        <nav aria-label="FAQ sections" className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-2">
            <Eyebrow>Questions about</Eyebrow>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="w-fit rounded-xs text-sm text-neutral-700 underline-offset-4 hover:text-neutral-950 hover:underline"
              >
                {s.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-16">
          {SECTIONS.map((s) => (
            <Reveal as="section" key={s.id} className="scroll-mt-28" >
              <h2 id={s.id} className="font-display text-3xl font-bold tracking-[-0.035em] text-neutral-950">
                {s.title}
              </h2>
              <div className="mt-4">
                <Accordion type="single" collapsible>
                  {s.items.map((item) => (
                    <AccordionItem key={item.q} value={item.q}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    id: "finding-a-space",
    title: "Finding a space",
    items: [
      {
        q: "What kinds of spaces are on StudioSpace?",
        a: "Five categories: photography studios, film and video spaces, podcast rooms, music studios, and art or creative workshops. Many doubles — a photo studio that shoots films, a rehearsal room that records — so read the equipment list, not just the title.",
      },
      {
        q: "How do I know a space is right for my project?",
        a: "Every listing shows photos, size in square feet, maximum capacity, equipment and amenities, the minimum and maximum hours you can book, and the host's own notes. If something isn't clear, message the host from the studio page.",
      },
      {
        q: "Do I need an account to browse?",
        a: "No — browsing is open to everyone. You only need an account when you want to send a booking request or save studios to your favorites.",
      },
      {
        q: "Can I save studios to compare later?",
        a: "Yes. Tap the heart on any studio and it lands in your Favorites. Signed-in hosts can favorite spaces too — everyone scouts eventually.",
      },
    ],
  },
  {
    id: "booking-and-approvals",
    title: "Booking and approvals",
    items: [
      {
        q: "How do booking requests work?",
        a: "You pick a date, a start time and a duration, optionally add a message about your project, and send the request. The host reviews it and either approves or declines. A request is a request — your slot is only reserved once the host confirms.",
      },
      {
        q: "Why does a host have to approve my request?",
        a: "Because the person who knows the space best should decide who uses it and when. Only the host can confirm overlapping dates, prepare the room, or make sensible exceptions. It keeps bookings reliable rather than automated-lucky.",
      },
      {
        q: "How long do hosts take to respond?",
        a: "It varies by host, and demo hosts are fictional. In a request still pending your My Bookings page shows its status, and expired requests are marked instead of disappearing silently.",
      },
      {
        q: "What if two people request the same time?",
        a: "One slot, one booking. Once a host confirms a request, that time is locked; an overlapping request can't be confirmed on top of it. If your request gets declined for this reason, explore nearby spaces or ask the host for another day.",
      },
      {
        q: "The slot I wanted disappeared. What happened?",
        a: "Someone's request was confirmed first. You'll see the time greyed out on the calendar, and if you try to send a request for that exact slot, we'll stop you with a message that it's no longer available.",
      },
      {
        q: "Can I book for just an hour?",
        a: "Depends on the studio — each listing states its minimum booking. Some do single hours, most ask for two or three. Durations beyond the minimum follow the studio's maximum and opening hours.",
      },
    ],
  },
  {
    id: "payments-and-cancellation",
    title: "Payments and cancellation",
    items: [
      {
        q: "Do I pay through StudioSpace?",
        a: "No. There's no online payment in this build. Payment for the session — and any security deposit the studio lists — is arranged directly between you and the host.",
      },
      {
        q: "What is the security deposit for?",
        a: "Some listings quote a refundable deposit against damage or overtime. It's shown on the studio page and in your booking summary so there are no surprises — how it's held and returned is agreed with the host directly.",
      },
      {
        q: "Can I cancel a booking?",
        a: "Yes, while a request is pending or already confirmed, from My Bookings. Every studio publishes a cancellation policy — flexible, moderate or strict — which explains how late changes work with the host.",
      },
      {
        q: "What happens if my request is declined or expires?",
        a: "Nothing is charged — there's no payment to refund. The request is marked Declined or Expired in your history and you're free to book another space or date.",
      },
    ],
  },
  {
    id: "hosting",
    title: "Hosting",
    items: [
      {
        q: "How do I list my studio?",
        a: "Use List Your Space and go through five short steps: the basics, pricing, photos and amenities, availability, then a preview before you publish. You can save a draft and finish later — drafts stay private until you say otherwise.",
      },
      {
        q: "What does hosting cost?",
        a: "Listing is free. Because payments happen directly between host and creator, StudioSpace doesn't touch your money in this build.",
      },
      {
        q: "How do I control when my studio is bookable?",
        a: "Set weekly opening hours — day by day, opening to closing — and block specific dates you need for yourself. Only times inside those windows ever reach the creator's calendar.",
      },
      {
        q: "Can I take my listing offline without deleting it?",
        a: "Yes. Pause it from My Listings when you need breathing room, and republish when you're ready. Paused listings stay out of search and stop accepting requests, and can be archived when they're done for good.",
      },
      {
        q: "What are my obligations towards creators?",
        a: "Be reachable, respond to requests, keep your listing truthful, honor your stated cancellation policy, and have the space ready as described. That's the whole contract underneath the platform.",
      },
    ],
  },
  {
    id: "account",
    title: "Your account",
    items: [
      {
        q: "Can I be both a host and a creator?",
        a: "Yes — one account does both. List your studio and book other people's spaces with the same profile. The only line we hold: you can't book your own listing.",
      },
      {
        q: "How do I change my details?",
        a: "Your Profile page handles your name, location and short bio. Your email stays as the account's anchor in this build.",
      },
      {
        q: "This site is a demo — what does that mean for my account?",
        a: "It means everything lives in your own browser: accounts, listings, bookings and favorites are stored locally on this device for everyone to review. When the real backend arrives, real accounts replace them.",
      },
    ],
  },
];
