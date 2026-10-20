import type { Metadata } from "next";

import { LegalPage } from "@/features/legal/components/legal-page";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.legal.privacy.title,
    description: d.legal.privacy.description,
  };
}

export default async function PrivacyPage() {
  const d = await getDict();

  return <LegalPage {...d.legal.privacy} lastUpdated={d.legal.lastUpdated} />;
}
