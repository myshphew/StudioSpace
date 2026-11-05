import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold tracking-[-0.01em] transition-colors duration-200 ease-[var(--ease-standard)] disabled:pointer-events-none disabled:opacity-55 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-orange text-brand-charcoal hover:bg-[#f25d27] active:bg-[#e65521]",
        secondary:
          "border border-neutral-300 bg-transparent text-neutral-950 hover:bg-neutral-100 hover:border-neutral-400",
        dark: "bg-neutral-950 text-brand-canvas hover:bg-neutral-800",
        outlineLight:
          "border border-neutral-800 text-neutral-950 hover:border-neutral-950 hover:bg-neutral-950 hover:text-brand-canvas",
        outlineDark:
          "border border-neutral-700 bg-transparent text-neutral-100 hover:border-neutral-100 hover:bg-neutral-100/10",
        ghost:
          "bg-transparent text-neutral-950 hover:bg-neutral-100 active:bg-neutral-200",
        onDark:
          "bg-brand-canvas text-neutral-950 hover:bg-white",
        onOrange:
          "bg-neutral-950 text-brand-canvas hover:bg-neutral-800",
        link: "text-neutral-950 underline-offset-4 hover:underline !px-0 !h-auto",
      },
      size: {
        sm: "h-10 px-4 text-[13px]",
        md: "h-12 px-6",
        lg: "h-13 px-7",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
