import { SiteHeader } from "@/components/layout/SiteHeader";
import { Banner } from "@/components/layout/Banner";
import { PublicLayoutClient } from "./layout-client";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <SiteHeader variant="public" />
      <PublicLayoutClient>{children}</PublicLayoutClient>
    </div>
  );
}
