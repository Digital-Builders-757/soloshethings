/**
 * Community Place/Story Detail Page
 * 
 * Authenticated route - requires login
 * Full community post content (auth-gated)
 * Public previews shown on home page, full content here
 */

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // TODO: Auth check
  // const user = await getUser();
  // if (!user) redirect('/login');
  
  // TODO: Fetch community post by slug
  // const post = await getCommunityPost(slug, user.id);
  // if (!post) notFound();
  
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Auth-gated placeholder */}
        <div className="bg-brand-yellow1 text-black p-6 rounded-lg mb-8">
          <p className="font-semibold">
            🔒 This is an authenticated route. Full implementation coming in Phase 1.
          </p>
          <p className="mt-2">
            Place slug: {slug}
          </p>
        </div>
        
        <article>
          {/* Placeholder content - will be replaced with real community post */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Place/Story Title
            </h1>
            <div className="text-neutral-600 mb-6">
              <span>By Community Member</span>
              <span className="mx-2">•</span>
              <time dateTime="2025-01-27">January 27, 2025</time>
            </div>
            <div className="aspect-video bg-neutral-200 rounded-lg mb-8"></div>
          </header>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Full community post content will be displayed here. This content
              requires authentication to view. Public previews are shown on the
              home page to encourage signups.
            </p>
            <p>
              Privacy controls (public/private) will be enforced via RLS policies.
            </p>
          </div>
        </article>
        
        <nav className="mt-16 pt-8 border-t border-neutral-200">
          <a
            href="/"
            className="text-brand-blue1 hover:text-brand-blue2 font-medium"
          >
            ← Back to Home
          </a>
        </nav>
      </div>
    </main>
  );
}

