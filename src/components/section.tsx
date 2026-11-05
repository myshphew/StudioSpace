import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}

/** Eyebrow + display heading + supporting description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow className={cn(description && "mb-1")}>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-xl text-base leading-relaxed text-neutral-700">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** Large page-intro header used on secondary pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-5 pt-14 sm:pt-20", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-neutral-950 sm:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-700">{description}</p>
      ) : null}
      {children}
    </header>
  );
}
