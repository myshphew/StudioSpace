import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { StudioBookingsContent } from "@/components/host/studio-bookings-content";

export const metadata = {
  title: "Listing Bookings — StudioSpace",
  description: "Incoming bookings for this studio — approve, decline and review.",
};

export default function ListingBookingsPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Hosting"
        title="Studio bookings."
        description="Requests and sessions for this space — you confirm or decline each one."
      />
      <div className="mt-14">
        <RequireAuth>
          <StudioBookingsContent />
        </RequireAuth>
      </div>
    </div>
  );
}
