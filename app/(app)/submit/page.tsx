/**
 * Submit a Spot/Story Page
 * 
 * Authenticated route - requires login
 * Submission form for community contributions
 * Privacy controls and moderation considerations
 */

export default function SubmitPage() {
  // TODO: Auth check
  // const user = await getUser();
  // if (!user) redirect('/login');
  
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Submit a Safe Spot</h1>
        
        {/* Auth-gated placeholder */}
        <div className="bg-brand-yellow1 text-black p-6 rounded-lg mb-8">
          <p className="font-semibold">
            🔒 This is an authenticated route. Full form implementation coming in Phase 1.
          </p>
        </div>
        
        {/* Submission form shell */}
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue1 focus:border-transparent"
              placeholder="Name of the safe spot or story title"
              disabled
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue1 focus:border-transparent"
              placeholder="Tell us about this safe spot or share your travel story..."
              disabled
            />
          </div>
          
          <div>
            <label htmlFor="images" className="block text-sm font-medium mb-2">
              Photos
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
              <p className="text-neutral-600">Image upload will be implemented in Phase 1</p>
              <p className="text-sm text-neutral-500 mt-2">
                Privacy: We do not use face recognition on your photos
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="privacy" className="block text-sm font-medium mb-2">
              Privacy Setting
            </label>
            <select
              id="privacy"
              name="privacy"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue1 focus:border-transparent"
              disabled
            >
              <option value="public">Public - All authenticated users can see</option>
              <option value="private">Private - Only you can see</option>
            </select>
          </div>
          
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-700">
              <strong>Privacy Note:</strong> Your photos are yours. We do not use face
              recognition technology on user-uploaded content. See our{" "}
              <a href="/privacy" className="text-brand-blue1 hover:text-brand-blue2">
                Privacy Policy
              </a>{" "}
              for more information.
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-brand-blue1 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-blue2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            Submit (Coming in Phase 1)
          </button>
        </form>
      </div>
    </main>
  );
}

