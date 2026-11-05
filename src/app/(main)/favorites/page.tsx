import { RequireAuth } from "@/components/gates";
import { PageHeader } from "@/components/section";
import { FavoritesGrid } from "@/components/account/favorites-grid";

export const metadata = {
  title: "Favorites — StudioSpace",
  description: "The studios you've saved for later — compare, share, book.",
};

export default function FavoritesPage() {
  return (
    <div className="container-page pb-24">
      <PageHeader
        eyebrow="Saved for later"
        title="Favorites."
        description="Keep the spaces you loved in one place — compare them side by side before you commit."
      />
      <div className="mt-14">
        <RequireAuth>
          <FavoritesGrid />
        </RequireAuth>
      </div>
    </div>
  );
}
