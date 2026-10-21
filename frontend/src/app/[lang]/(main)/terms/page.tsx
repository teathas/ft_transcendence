import type { Metadata } from "next";

import { LegalPage } from "@/features/legal/components/legal-page";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: d.legal.terms.title,
    description: d.legal.terms.description,
  };
}

export default async function TermsPage() {
  const d = await getDict();

  return <LegalPage {...d.legal.terms} lastUpdated={d.legal.lastUpdated} />;
}
