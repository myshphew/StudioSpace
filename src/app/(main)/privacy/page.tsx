import { PageHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/section";

export const metadata = {
  title: "Privacy Policy — StudioSpace",
  description:
    "What StudioSpace collects, why, how long it stays, and the controls you have over your own data.",
};

export default function PrivacyPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy."
        description="What we collect, what we do with it, and what you control. No dark patterns, no data broker affiliations, no selling your inbox."
      />

      <Reveal className="mt-16">
        <p className="rounded-md bg-warning-soft px-5 py-4 text-sm leading-relaxed text-neutral-800">
          <strong>Preview copy.</strong> This demo ships with placeholder privacy
          text. Have a definitive policy drafted against your real data
          practices — and reviewed by a qualified legal adviser — before launch.
        </p>
      </Reveal>

      <Reveal as="div" className="mt-14 flex flex-col gap-3 text-sm leading-relaxed text-neutral-700">
        <p>
          StudioSpace works with the least data a marketplace can run on: who
          you are, how to reach you, what you list or book. We don&rsquo;t run
          ads, and this demo doesn&rsquo;t process payments.
        </p>
        <p>Last updated: January 2026 · Version 1.0 (demo)</p>
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
    id: "who-this-covers",
    title: "Who this covers",
    paragraphs: [
      "This policy applies to visitors browsing StudioSpace and to anyone with an account — creators booking spaces and hosts listing them.",
      "In this demo build, accounts and content exist only in your own browser's local storage. The real backend will replace it with server-side accounts under this same spirit.",
    ],
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    paragraphs: [
      "Account data: your name, email address and password, plus the optional location and short bio you add to your profile.",
      "Platform data: the studios you list, the booking requests you send or receive, your favorites, and references on records like status changes.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    paragraphs: [
      "To run the marketplace: create and secure your account, publish your listings, route requests between creators and hosts, keep booking records accurate, and show your saves.",
      "To keep the community safe: detect misuse, prevent double-booked slots from being confirmed, and support appeals when something goes wrong.",
    ],
  },
  {
    id: "legal-bases",
    title: "Legal bases (for EU/UK visitors)",
    paragraphs: [
      "Contract performance for anything needed to provide your account and your bookings; legitimate interests for keeping the platform safe and improving it; consent where we ask — e.g. optional notifications.",
      "Where we rely on consent, you can withdraw it at any time without affecting prior processing.",
    ],
  },
  {
    id: "demo-local-storage",
    title: "Demo data lives with you",
    paragraphs: [
      "This preview stores accounts, listings, bookings and favorites in your browser's local storage, on your own device.",
      "Clearing site data is the honest equivalent of an account deletion — everything this demo knows about you disappears. Other visitors on the same device and browser see your demo data; that's why we say don't treat it as a real account.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing",
    paragraphs: [
      "The people you deal with see what a booking needs: hosts see request details from the creator and vice versa — name, email, message, studio and slot.",
      "We don't sell personal data and we don't share it with advertisers. Service providers (hosting, email delivery, error monitoring) get only what they need to do their job, under contract.",
    ],
  },
  {
    id: "cookies-and-tracking",
    title: "Cookies and tracking",
    paragraphs: [
      "In this build we use only what the platform needs: your demo session reference and demo data in local storage. No analytics, advertising or cross-site tracking cookies.",
      "A production version will list every cookie here, with a consent control you can actually use.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    paragraphs: [
      "Account data stays while your account does. Listings and bookings are kept in your history — pending and confirmed records matter to both sides of a session.",
      "After an account is closed, we remove or anonymize personal data within 90 days, except what we're legally required to keep and minimal records that prevent banned accounts from returning.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "The production build will encrypt data in transit and at rest, hash passwords, and audit access to personal data. In this demo, security equals your device: nothing leaves your browser.",
      "No system is perfect. If you believe your data has been exposed, tell us at hello@studiospace.app so we can respond quickly.",
    ],
  },
  {
    id: "cross-border-transfers",
    title: "Cross-border transfers",
    paragraphs: [
      "The real backend may run on infrastructure outside your country, which means data may cross borders. Where that happens we'll rely on recognized transfer mechanisms, such as standard contractual clauses.",
      "For the demo, nothing crosses any border — it stays in your browser.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      "You can access and edit your details from your Profile, and download your records (listings, bookings) on request. Data export arrives in the production build.",
      "You can object to processing, ask for correction or deletion, and — where applicable — exercise the right to data portability and to lodge a complaint with your data protection authority.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "StudioSpace is for adults — host and creator alike. It isn't aimed at children under the age required by your jurisdiction for consent (typically 16); we don't knowingly collect their data.",
      "If we learn a child has an account, we close it and delete their data as fast as we can.",
    ],
  },
  {
    id: "changes-and-contact",
    title: "Changes & contact",
    paragraphs: [
      "As the product grows, this policy grows too — material changes get a notice ahead of time and a version bump at the top.",
      "Questions, requests, or a supervisory authority referral: hello@studiospace.app, StudioSpace, Gulshan 2, Dhaka 1212, Bangladesh.",
    ],
  },
];
