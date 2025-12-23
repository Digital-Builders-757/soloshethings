/**
 * Authenticated App Layout
 * 
 * Routes in this group require authentication.
 * Middleware will handle auth checks.
 */

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

