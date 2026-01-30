'use client';

export function NewsletterSignup() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: Implement newsletter signup
        alert('Newsletter signup coming soon!');
      }}
      className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
    >
      <input
        type="email"
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 rounded-full border-2 border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue1 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-brand-blue1 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-blue2 transition-all btn-glow active:scale-[0.98]"
      >
        Subscribe
      </button>
    </form>
  );
}