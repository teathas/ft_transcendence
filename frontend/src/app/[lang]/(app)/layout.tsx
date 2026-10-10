import { AppShell } from "@/components/layout/app-shell";
import { RequireAuth } from "@/features/auth/components/route-guards";

export default function AppLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
