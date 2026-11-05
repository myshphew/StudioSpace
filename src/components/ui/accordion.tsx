"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-neutral-200", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-6 text-left outline-none",
          className,
        )}
        {...props}
      >
        <span className="font-display text-lg font-bold tracking-[-0.025em] text-neutral-950 transition-colors group-hover:text-brand-orange sm:text-xl">
          {children}
        </span>
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors group-hover:border-neutral-950 group-hover:text-neutral-950 group-data-[state=open]:rotate-45">
          <Plus className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm leading-relaxed text-neutral-700"
      {...props}
    >
      <div className={cn("max-w-2xl pb-6", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
