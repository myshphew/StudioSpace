import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { EditStudioContent } from "@/components/host/edit-studio-content";

export const metadata = {
  title: "Edit Listing — StudioSpace",
  description: "Update your listing's details, pricing, photos and availability.",
};

export default function EditListingPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Hosting"
        title="Edit listing."
        description="Change what's here, and the listing updates everywhere it's shown."
      />
      <div className="mt-14">
        <RequireAuth>
          <EditStudioContent />
        </RequireAuth>
      </div>
    </div>
  );
}
