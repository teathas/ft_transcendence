import type { Metadata } from "next";

import { PublicProfileView } from "@/features/friends/components/public-profile-view";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.publicProfile.metaTitle,
    description: d.publicProfile.metaDescription,
  };
}

export default async function PublicProfilePage({
  params,
}: PageProps<"/[lang]/users/[userId]">) {
  const { userId } = await params;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <PublicProfileView userId={userId} />
      </div>
    </div>
  );
}
