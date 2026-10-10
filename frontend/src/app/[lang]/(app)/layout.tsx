import { AppShell } from "@/components/layout/app-shell";

export default function AppLayout({ children }: LayoutProps<"/[lang]">) {
  return <AppShell>{children}</AppShell>;
}
