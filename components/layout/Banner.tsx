import Link from "next/link"

export function Banner() {
  return (
    <div className="border-b border-[#f3d6b2] bg-[#f7e8be]">
      <div className="container mx-auto flex flex-col gap-2 px-6 py-3 text-center text-[#7a331b] sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a14b24]">
          Editorial travel journal + community for women exploring solo
        </p>
        <Link
          href="/signup"
          className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a331b] transition-colors hover:text-[#e34b16]"
        >
          Join the journey
        </Link>
      </div>
    </div>
  )
}
