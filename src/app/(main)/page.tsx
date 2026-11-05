import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/marketing/search-bar";
import { FeaturedStudios } from "@/components/marketing/featured-studios";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/section";
import { IMG } from "@/lib/demo/images";
import { HomeSteps } from "@/components/marketing/home-steps";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-24 py-24 sm:gap-28 sm:py-28 lg:gap-32 lg:py-32">
        <FeaturedStudios />
        <CategoryGrid />
        <HomeSteps />
        <WhyStudioSpace />
        <HostCta />
        <FinalCta />
      </div>
    </>
  );
}

function Hero() {
  return (
    <section
      className="container-page"
      aria-label="Find your space. Make something extraordinary."
    >
      <div className="grid gap-8 pt-12 sm:pt-16 lg:grid-cols-[7fr_5fr] lg:gap-12 lg:pt-20">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <Eyebrow>A creative space marketplace</Eyebrow>
          <h1 className="text-display text-[clamp(3.25rem,8vw,6.5rem)] text-neutral-950">
            Find your space.
            <br />
            Make something{" "}
            <span className="font-editorial font-normal italic tracking-[-0.02em]">
              extraordinary.
            </span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-neutral-700 sm:text-lg">
            From photography studios to podcast rooms, discover creative spaces
            that bring your next big idea to life.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/studios">Explore Studios</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/add-studio">List Your Space</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 lg:aspect-auto lg:h-full lg:min-h-[420px]">
            <Image
              src={IMG.photoStudioCyc}
              alt="Inside a photography studio with a white cyclorama wall, softboxes and lighting stands"
              fill
              priority
              sizes="(min-width: 1024px) 41vw, 92vw"
              className="object-cover"
            />
          </div>
          <figure className="absolute bottom-4 left-4 hidden rounded-sm bg-neutral-50/90 px-3 py-2 text-xs backdrop-blur sm:block">
            <figcaption className="font-semibold text-neutral-950">The White Room Studio</figcaption>
            <p className="text-neutral-600">Photography · Gulshan 2, Dhaka</p>
          </figure>
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <SearchBar />
      </div>
    </section>
  );
}

function WhyStudioSpace() {
  const features = [
    {
      n: "01",
      title: "Spaces for every idea",
      copy: "From small recording rooms to full-scale production studios, find a space that fits your work.",
    },
    {
      n: "02",
      title: "Know what you're booking",
      copy: "Explore photos, amenities, equipment, pricing and studio details before sending a request.",
    },
    {
      n: "03",
      title: "Direct connection",
      copy: "Connect with space owners and arrange the details of your booking directly.",
    },
    {
      n: "04",
      title: "Built around your schedule",
      copy: "Explore available dates and request the time that works for your project.",
    },
  ];

  return (
    <section aria-labelledby="why-heading" className="container-page">
      <Reveal className="flex flex-col gap-4">
        <Eyebrow>Made for creators</Eyebrow>
        <h2
          id="why-heading"
          className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-5xl"
        >
          More than four walls. A place to make things happen.
        </h2>
        <p className="max-w-xl text-base text-neutral-700">
          We bring creative people and creative spaces closer together, making it
          easier to find the right environment for every project.
        </p>
      </Reveal>

      <dl className="mt-12 grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.n} delay={i * 60} className="h-full">
            <div className="flex h-full flex-col gap-5 bg-neutral-50 p-6 sm:p-8">
              <p className="font-display text-4xl font-black tracking-[-0.04em] text-neutral-300">
                {f.n}
              </p>
              <div className="flex flex-col gap-2">
                <dt className="font-display text-lg font-bold tracking-[-0.025em] text-neutral-950">
                  {f.title}
                </dt>
                <dd className="text-sm leading-relaxed text-neutral-700">{f.copy}</dd>
              </div>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

function HostCta() {
  return (
    <section aria-labelledby="host-cta-heading" className="container-page">
      <Reveal className="relative overflow-hidden rounded-xl bg-brand-orange px-6 py-16 sm:px-12 sm:py-20">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-10 select-none font-display text-[11rem] font-black leading-none tracking-[-0.06em] text-brand-charcoal/10 sm:text-[16rem]"
        >
          *
        </p>
        <div className="relative flex max-w-3xl flex-col items-start gap-5">
          <p className="eyebrow text-brand-charcoal/70">Have a creative space?</p>
          <h2
            id="host-cta-heading"
            className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-brand-charcoal sm:text-5xl"
          >
            Your space could inspire someone&rsquo;s next big idea.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-brand-charcoal/80">
            Turn your creative space into an opportunity. Share it with
            photographers, filmmakers, musicians and creators looking for
            somewhere to make their next project happen.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button asChild variant="dark" size="lg">
              <Link href="/add-studio">
                List Your Space
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <p className="text-sm font-medium text-brand-charcoal">
              Have questions?{" "}
              <Link
                href="/how-it-works"
                className="underline underline-offset-4 hover:text-brand-charcoal/70"
              >
                Learn how hosting works.
              </Link>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="container-page">
      <Reveal className="flex flex-col items-center gap-5 border-y border-neutral-200 py-20 text-center sm:py-24">
        <h2
          id="final-cta-heading"
          className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-6xl"
        >
          Your next idea needs a place.
        </h2>
        <p className="max-w-md text-base text-neutral-700">
          Explore creative spaces, find your fit and start making something
          memorable.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/studios">Find Your Space</Link>
        </Button>
      </Reveal>
    </section>
  );
}
