import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { ProfileContent } from "@/components/account/profile-content";

export const metadata = {
  title: "My Profile — StudioSpace",
  description: "Your name, location and bio as they appear across StudioSpace.",
};

export default function ProfilePage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Your account"
        title="My Profile."
        description="How creators and hosts see you — keep it human, keep it current."
      />
      <div className="mt-14">
        <RequireAuth>
          <ProfileContent />
        </RequireAuth>
      </div>
    </div>
  );
}
