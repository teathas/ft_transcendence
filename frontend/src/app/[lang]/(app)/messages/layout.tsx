import { MessagesShell } from "@/features/messages/components/messages-shell";

export default function MessagesLayout({ children }: LayoutProps<"/[lang]/messages">) {
  return <MessagesShell>{children}</MessagesShell>;
}
