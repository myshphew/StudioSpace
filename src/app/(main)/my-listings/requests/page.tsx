import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { RequestsQueueContent } from "@/components/host/requests-queue-content";

export const metadata = {
  title: "Booking Requests — StudioSpace",
  description: "Every incoming booking request across your listings, in one queue.",
};

export default function BookingRequestsPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Hosting"
        title="Booking Requests."
        description="Approve what fits, decline what doesn't — a request only becomes a booking once you say so."
      />
      <div className="mt-14">
        <RequireAuth>
          <RequestsQueueContent />
        </RequireAuth>
      </div>
    </div>
  );
}
