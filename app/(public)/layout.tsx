import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicLayoutClient } from "./layout-client";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="public" />
      <PublicLayoutClient>{children}</PublicLayoutClient>
    </>
  );
}

