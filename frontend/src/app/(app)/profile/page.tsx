import type { Metadata } from "next";

import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your photo, account details and password.",
};

export default function ProfilePage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <ProfileView />
      </div>
    </div>
  );
}
