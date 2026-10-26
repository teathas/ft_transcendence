import { AppShell } from "@/components/layout/app-shell";
import { RequireAuth } from "@/features/auth/components/route-guards";
import { TermsGate } from "@/features/auth/components/terms-gate";

export default function AppLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <RequireAuth>
      <TermsGate>
        <AppShell>{children}</AppShell>
      </TermsGate>
    </RequireAuth>
  );
}
