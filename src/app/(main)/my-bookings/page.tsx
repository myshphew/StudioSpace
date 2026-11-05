import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { BookingsContent } from "@/components/account/bookings-content";

export const metadata = {
  title: "My Bookings — StudioSpace",
  description: "Every booking request you've sent, in every state it can be.",
};

export default function MyBookingsPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Your sessions"
        title="My Bookings."
        description="Requests stay pending until a host approves — statuses here never skip ahead of that."
      />
      <div className="mt-14">
        <RequireAuth>
          <BookingsContent />
        </RequireAuth>
      </div>
    </div>
  );
}
