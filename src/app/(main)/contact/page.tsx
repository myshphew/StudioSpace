import { PageHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/section";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata = {
  title: "Contact — StudioSpace",
  description:
    "Questions about a space, hosting, partnerships or this demo — write to the StudioSpace team.",
};

export default function ContactPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Contact"
        title="Talk to a person, not a form black hole."
        description="Questions about a space, ideas for hosting, or something else entirely — messages land with our small team, and we read every one."
      />

      <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={80} className="flex flex-col gap-8">
          <aside className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
            <div className="flex flex-col gap-2">
              <Eyebrow>Email</Eyebrow>
              <p className="text-sm leading-relaxed text-neutral-700">
                hello@studiospace.app
                <br />
                <span className="text-neutral-500">We reply within 2 working days.</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-neutral-200 pt-6">
              <Eyebrow>Studio</Eyebrow>
              <p className="text-sm leading-relaxed text-neutral-700">
                StudioSpace
                <br />
                Gulshan 2, Dhaka 1212
                <br />
                Bangladesh
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-neutral-200 pt-6">
              <Eyebrow>Before you write</Eyebrow>
              <p className="text-sm leading-relaxed text-neutral-700">
                Booking questions are fastest answered on the studio page — your
                message goes straight to that host with a request.
              </p>
            </div>
          </aside>

          <p className="text-xs leading-relaxed text-neutral-500">
            Demo build — the form doesn&rsquo;t send email yet. It shows exactly
            where the backend call will land.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
