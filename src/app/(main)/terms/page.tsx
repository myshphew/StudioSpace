import { PageHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/section";

export const metadata = {
  title: "Terms & Conditions — StudioSpace",
  description:
    "The plain-language terms that govern using StudioSpace — accounts, listings, bookings, conduct and everything in between.",
};

export default function TermsPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Legal"
        title="Terms &amp; Conditions."
        description="The agreement between you and StudioSpace when you browse, book or host. Written to be read, not to be survived."
      />

      <Reveal className="mt-16">
        <p className="rounded-md bg-warning-soft px-5 py-4 text-sm leading-relaxed text-neutral-800">
          <strong>Preview copy.</strong> This demo ships with placeholder legal
          text so the product flows can be reviewed end to end. Have real terms
          drafted and reviewed by a qualified legal adviser before launch.
        </p>
      </Reveal>

      <Reveal as="div" className="mt-14 flex flex-col gap-3 text-sm leading-relaxed text-neutral-700">
        <p>
          These Terms apply to every visit and account on StudioSpace — whether
          you&rsquo;re browsing, booking a space, or opening yours to others.
          By using the platform you accept the whole document, so start with the
          summaries and dig in where you need to.
        </p>
        <p>
          Last updated: January 2026 · Version 1.0 (demo)
        </p>
      </Reveal>

      <div className="mt-16 flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
        {SECTIONS.map((s, i) => (
          <Reveal as="section" key={s.id} className="scroll-mt-28 grid gap-4 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
            <div>
              <Eyebrow>{`Section ${String(i + 1).padStart(2, "0")}`}</Eyebrow>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-neutral-950">
                {s.title}
              </h2>
            </div>
            <div className="max-w-2xl flex flex-col gap-4 text-sm leading-relaxed text-neutral-700">
              {s.paragraphs.map((p, j) => (
                <p key={j} className={j === 0 ? "font-medium text-neutral-950" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    id: "about-these-terms",
    title: "About these terms",
    paragraphs: [
      "StudioSpace is a peer-to-peer marketplace: hosts list creative production spaces, creators send booking requests, and the host's approval confirms the booking.",
      "We provide the platform, profiles, listings, request flow and records. We are not the owner, operator or manager of any listed studio, and we don't take part in any booking beyond operating the marketplace itself.",
    ],
  },
  {
    id: "your-account",
    title: "Your account",
    paragraphs: [
      "You need an account to book spaces or list your own. Give accurate details, keep your sign-in to yourself, and tell us if you think someone used your account without permission.",
      "You must be old enough to contract in your jurisdiction. One account per person; you can host and book from the same profile, but one role's misconduct limits the other.",
    ],
  },
  {
    id: "listing-a-studio",
    title: "Listing a studio",
    paragraphs: [
      "If you list a space, describe it truthfully: real photos, real equipment, real amenities, real minimum hours. The weekly availability you publish is what creators see — keep it true.",
      "You decide booking rules for your space: opening hours, blocked dates, advance window, cancellation policy and any security deposit. Listings must be spaces you're entitled to offer. We may unpublish listings that mislead.",
    ],
  },
  {
    id: "booking-requests",
    title: "Booking requests & approvals",
    paragraphs: [
      "Every booking starts as a request and stays pending until the host approves. Nothing is reserved in the meantime — a slot stays open to other requests until confirmed.",
      "Hosts approve or decline at their discretion and aren't required to explain a decline. A confirmed booking locks the slot; later requests for that time can't also be confirmed.",
    ],
  },
  {
    id: "paying-for-sessions",
    title: "Fees, payments and deposits",
    paragraphs: [
      "In this build, money never moves through StudioSpace. Session fees and any security deposit shown on a listing are arranged and settled directly between host and creator by whatever means both sides agree on.",
      "Because of that, StudioSpace issues no invoices, refunds or payment protection. Get payment terms clear in writing with your host or guest before the session.",
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations",
    paragraphs: [
      "Creators can cancel pending or confirmed requests from My Bookings. Hosts can decline pending requests. When either side cancels a confirmed booking, follow the cancellation policy listed on the studio.",
      "A cancelled session releases its slot to other requests. Repeated cancellations, by either side, can affect standing.",
    ],
  },
  {
    id: "house-rules",
    title: "House rules",
    paragraphs: [
      "During a session, respect the space and the neighbourhood: use the studio as described, honor the host's rules (guests, noise, equipment, closing time) and leave it as you found it.",
      "Don't use a listed space — or StudioSpace itself — for anything unlawful or that would make a host regret giving you the keys.",
    ],
  },
  {
    id: "content-you-share",
    title: "Content you share",
    paragraphs: [
      "Your listings, messages, reviews and profile belong to you, but you let us display them on StudioSpace as needed to operate the platform. Only share content you have the rights to.",
      "Keep reviews about the session, not the person. False, abusive or borrowed content may be removed, and the account that posted it can be limited.",
    ],
  },
  {
    id: "what-we-guarantee",
    title: "What we guarantee — and don't",
    paragraphs: [
      "We work hard to keep the platform available, correct and secure, but we don't guarantee uninterrupted service, that every request gets a host's approval, or that listing details are accurate — hosts write them.",
      "StudioSpace provides the meeting place; the session itself and everything that happens inside a host's four walls is the host's and creator's affair.",
    ],
  },
  {
    id: "liability",
    title: "Liability",
    paragraphs: [
      "To the extent the law allows, StudioSpace isn't liable for real or claimed losses tied to a booked session — damage, injury, lost footage, missed deadlines, disputes over fees — or for anything hosts or creators do off the platform.",
      "Where liability can't be excluded outright, it's limited to the smallest amount the law permits.",
    ],
  },
  {
    id: "suspension-and-removal",
    title: "Suspension & removal",
    paragraphs: [
      "We can suspend or close accounts, unpublish listings and remove content for breach of these terms, illegal use, fraud or behavior that endangers the community.",
      "We'll tell you when we do, with the reason, unless prevented by law. You can always close your own account; records we must keep for legal reasons survive closure.",
    ],
  },
  {
    id: "changes-law-contact",
    title: "Changes, governing law & questions",
    paragraphs: [
      "These terms change as the product does. Significant changes are announced in advance; continuing to use StudioSpace after they take effect means accepting them.",
      "The current demo build operates under 🇧🇩 law. Questions, disputes or a lawyer's red-pen on this document — write to hello@studiospace.app.",
    ],
  },
];
