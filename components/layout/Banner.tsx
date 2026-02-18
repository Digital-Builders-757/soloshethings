/**
 * Banner Component
 *
 * AWA-inspired top banner with brand colors
 * Presentational component - no interactivity or data fetching
 * Server Component by default
 */

export function Banner() {
  return (
    <section className="w-full bg-[#FB5315] py-4">
      <div className="flex items-center justify-center px-4">
        <h2 className="text-center text-lg font-semibold tracking-wide md:text-xl lg:text-2xl">
          <span className="text-[#FFD0A9]">{'Discover your '}</span>
          <span className="text-[#FFD0A9]">Solo</span>
          <span className="text-[#FFD0A9]">{' SHE Adventure!'}</span>
        </h2>
      </div>
    </section>
  );
}
