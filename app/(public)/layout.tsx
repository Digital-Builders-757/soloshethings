import { SiteHeader } from "@/components/layout/SiteHeader";
import { Banner } from "@/components/layout/Banner";
import { PublicLayoutClient } from "./layout-client";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Banner />
      <SiteHeader variant="public" />
      <PublicLayoutClient>{children}</PublicLayoutClient>
    </>
  );
}
