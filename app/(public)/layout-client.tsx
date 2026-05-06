"use client";

export function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-0 min-w-0 flex-1 flex-col shell-pb-safe">{children}</div>;
}
