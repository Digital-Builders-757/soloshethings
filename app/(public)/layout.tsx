import { SiteHeader } from "@/components/layout/SiteHeader";
import { Banner } from "@/components/layout/Banner";
import { PublicLayoutClient } from "./layout-client";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-white">
      <Banner />
      <SiteHeader />
      <PublicLayoutClient>{children}</PublicLayoutClient>
    </div>
  );
}
