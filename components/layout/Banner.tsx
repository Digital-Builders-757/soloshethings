import Link from "next/link"

export function Banner() {
  return (
    <div className="border-b border-[#ebd3b2] bg-[#f7e8be] pt-[env(safe-area-inset-top,0px)]">
      <div className="container mx-auto shell-inline flex flex-col gap-1 py-2 text-center text-[#6c351f] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-2.5 sm:text-left md:py-2.5">
        <p className="text-balance text-[0.8rem] font-semibold tracking-[0.14em] text-[#7a331b]">
          Editorial travel journal and community for women exploring solo
        </p>
        <Link
          href="/signup"
          className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#7a331b] transition-colors hover:text-[#e34b16]"
        >
          Join the journey
        </Link>
      </div>
    </div>
  )
}
