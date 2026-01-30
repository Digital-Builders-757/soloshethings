"use client";

import { usePathname } from "next/navigation";
import { Banner } from "@/components/layout/Banner";

export function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {isHomePage && <Banner />}
      {children}
    </>
  );
}
