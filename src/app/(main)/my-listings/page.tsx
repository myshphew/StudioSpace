import Link from "next/link";
import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { Button } from "@/components/ui/button";
import { MyListingsContent } from "@/components/host/my-listings-content";

export const metadata = {
  title: "My Listings — StudioSpace",
  description: "Every studio you've listed — drafts, published rooms and everything between.",
};

export default function MyListingsPage() {
  return (
    <div className="container-page pb-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <PageHeader
          eyebrow="Hosting"
          title="My Listings."
          description="Your rooms, in whatever state they're in. Publish, pause, edit — the space stays yours."
          className="max-w-2xl"
        />
        <Button asChild size="lg" className="hidden sm:inline-flex">
          <Link href="/add-studio">Add a Studio</Link>
        </Button>
      </div>
      <div className="mt-14">
        <RequireAuth>
          <MyListingsContent />
        </RequireAuth>
      </div>
    </div>
  );
}
