import Link from 'next/link'

import { EmptyState } from '@/components/ui/empty-state'

export default function BlogNotFound() {
  return (
    <main className="section-y shell-inline min-w-0 flex-1 overflow-x-clip">
      <div className="mx-auto max-w-7xl">
        <EmptyState
          id="blog-not-found"
          variant="blog"
          eyebrow="Publication"
          title="This article is not available"
          description="The story may have moved, or editorial content may still be connecting. Browse the latest guides or return home."
          primaryAction={{
            label: 'Browse SHE Stories →',
            href: '/blog',
            variant: 'primary',
          }}
          secondaryAction={{
            label: 'Back to home',
            href: '/',
            variant: 'secondary',
          }}
        />
        <p className="mx-auto mt-6 max-w-md text-center text-sm text-brand-blue/75">
          Looking for member stories instead?{' '}
          <Link
            href="/places"
            className="font-semibold text-brand-orange underline-offset-2 transition hover:text-brand-coral hover:underline"
          >
            Browse the community feed
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
