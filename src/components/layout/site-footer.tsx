import Link from "next/link";
import { Logo } from "@/components/logo";
import { FooterYear } from "@/components/layout/footer-year";

const COLUMNS: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: "Explore",
    links: [
      { href: "/studios", label: "Explore Studios" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/about", label: "About Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Hosting",
    links: [
      { href: "/add-studio", label: "List Your Space" },
      { href: "/my-listings", label: "My Listings" },
      { href: "/my-listings/requests", label: "Booking Requests" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="dark-section mt-24 bg-neutral-950 text-brand-canvas">
      <div className="container-page pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-8">
            <Logo dark />
            <p className="max-w-sm font-display text-2xl font-bold leading-[1.15] tracking-[-0.03em] text-brand-canvas sm:text-3xl">
              Spaces for ideas.
              <br />
              <span className="text-brand-orange">Built by creators.</span>
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
              A peer-to-peer creative workspace marketplace connecting creators with
              inspiring, bookable production spaces.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={`${col.heading}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-300 underline-offset-4 transition-colors hover:text-brand-canvas hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-neutral-800 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© <FooterYear /> StudioSpace. Dhaka, Bangladesh.</p>
          <p className="text-neutral-500">
            Demo build — every listing, booking and profile is fictional sample data.
          </p>
        </div>
      </div>
    </footer>
  );
}
