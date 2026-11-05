"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const IMAGE_LABELS = [
  "Main studio",
  "Shooting area",
  "Equipment corner",
  "Lounge area",
  "Studio setup",
];

/** Main 16:9 photograph plus a secondary grid, with a lightbox. */
export function Gallery({ images, studioName }: { images: string[]; studioName: string }) {
  const [active, setActive] = useState(0);
  const main = images[active % images.length];
  const secondary = images.slice(0, 4);

  return (
    <div className="grid gap-3 lg:grid-cols-[5fr_4fr]">
      <figure className="relative aspect-[16/10] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        <Image
          src={main}
          alt={galleryAlt(studioName, active)}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 92vw"
          className="object-cover"
        />
      </figure>

      <div className="relative grid grid-cols-2 gap-3 lg:grid-rows-2 lg:grid-cols-2">
        {secondary.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show photo ${i + 1}: ${IMAGE_LABELS[i % IMAGE_LABELS.length]}`}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-md border bg-neutral-100 outline-offset-2 outline-neutral-950",
              "lg:aspect-auto",
              active === i && "ring-2 ring-neutral-950",
            )}
          >
            <Image
              src={src}
              alt={galleryAlt(studioName, i)}
              fill
              sizes="(min-width: 1024px) 22vw, 45vw"
              className="object-cover transition-opacity duration-200 hover:opacity-85"
            />
          </button>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-sm bg-neutral-950/85 px-4 py-2.5 text-sm font-semibold text-brand-canvas backdrop-blur transition-colors hover:bg-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
            >
              <Expand className="size-4" aria-hidden />
              View All Photos
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>{studioName} — photo gallery</DialogTitle>
            </DialogHeader>
            <div className="grid max-h-[70vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
              {images.map((src, i) => (
                <figure key={`${src}-lg-${i}`} className="relative aspect-[16/10] overflow-hidden rounded-md bg-neutral-100">
                  <Image
                    src={src}
                    alt={galleryAlt(studioName, i)}
                    fill
                    sizes="(min-width: 1024px) 38vw, 92vw"
                    className="object-cover"
                  />
                  <figcaption className="absolute bottom-2 left-2 rounded-xs bg-neutral-950/70 px-2 py-1 text-[11px] font-medium text-brand-canvas">
                    {IMAGE_LABELS[i % IMAGE_LABELS.length]}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-neutral-500">
              Demo photography for StudioSpace design review.
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function galleryAlt(studioName: string, index: number) {
  const label = IMAGE_LABELS[index % IMAGE_LABELS.length];
  return `${studioName} — ${label.toLowerCase()}`;
}
