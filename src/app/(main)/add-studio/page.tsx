import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { AddStudioWizard } from "@/components/host/add-studio-wizard";

export const metadata = {
  title: "List Your Space — StudioSpace",
  description:
    "Add your studio in five short steps — basics, pricing, photos, availability and a final review.",
};

export default function AddStudioPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Have a creative space?"
        title="Add a studio."
        description="Five short steps and your room is in front of creators looking for exactly this. You can publish when it feels ready or keep it as a draft."
        className="max-w-3xl"
      />
      <div className="mt-14">
        <RequireAuth>
          <AddStudioWizard />
        </RequireAuth>
      </div>
    </div>
  );
}
