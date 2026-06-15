import { NavbarServer } from "@/components/navbar/NavbarServer";
import { PublicLayoutClient } from "./layout-client";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-[#fffaf0]">
      <NavbarServer />
      <PublicLayoutClient>{children}</PublicLayoutClient>
    </div>
  );
}
