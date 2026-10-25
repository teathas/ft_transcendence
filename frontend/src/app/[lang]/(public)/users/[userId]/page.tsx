import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicProfileView } from "@/features/friends/components/public-profile-view";
import {
  getPublicProfile,
  PublicProfileNotFoundError,
} from "@/features/friends/api/public-profile.server";
import { getDict } from "@/i18n/server";

async function profileOrNotFound(userId: string) {
  try {
    return await getPublicProfile(userId);
  } catch (error) {
    if (error instanceof PublicProfileNotFoundError) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/users/[userId]">): Promise<Metadata> {
  const [{ userId }, d] = await Promise.all([params, getDict()]);
  const profile = await profileOrNotFound(userId);
  return {
    title: profile.username,
    description: profile.bio ?? d.publicProfile.metaDescription,
  };
}

export default async function PublicProfilePage({
  params,
}: PageProps<"/[lang]/users/[userId]">) {
  const { userId } = await params;
  const profile = await profileOrNotFound(userId);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <PublicProfileView userId={userId} initialProfile={profile} />
      </div>
    </div>
  );
}
