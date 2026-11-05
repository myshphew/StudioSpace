import Image from "next/image";

/**
 * Fill-layout studio photograph wrapper with consistent optimization.
 * Parent containers control the aspect ratio.
 */
export function StudioImage({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 92vw",
  draggable = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  draggable?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      draggable={draggable}
      className={className}
    />
  );
}
