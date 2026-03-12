/**
 * Banner Component
 *
 * New design: Orange top banner + centered Logo text + nav row
 * Fixed height: 170px total
 */

export function Banner() {
  return (
    <div className="border-b border-[#e5e7eb]">
      {/* Top Announcement Banner - #fb5315 */}
      <div className="bg-[#fb5315] px-4 py-2 text-center">
        <p className="text-sm text-white">
          Discover your <span className="font-bold text-[#ffd0a9]">Solo SHE</span> Adventure!
        </p>
      </div>

      {/* Logo Row - Centered */}
      <div className="bg-white py-6 text-center">
        <span className="text-lg text-[#4b5563]">Logo</span>
      </div>
    </div>
  )
}
