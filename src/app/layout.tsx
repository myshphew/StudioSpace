import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

const satoshi = localFont({
  src: [
    { path: "./fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/satoshi-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/satoshi-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "StudioSpace — Spaces for ideas. Built by creators.",
    template: "%s — StudioSpace",
  },
  description:
    "StudioSpace connects creators with inspiring spaces to bring their ideas to life. Discover photography studios, film stages, podcast rooms, music suites and creative workspaces — all in one place.",
  openGraph: {
    type: "website",
    siteName: "StudioSpace",
    title: "StudioSpace — Spaces for ideas. Built by creators.",
    description:
      "A peer-to-peer marketplace connecting creative people with inspiring, bookable production spaces.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F4EE",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}
    >
      <body suppressHydrationWarning className="min-h-dvh bg-brand-canvas text-neutral-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
