/**
 * Social Proof Stats Section
 * 
 * 4 stats in a row showing community reach
 */

export function SocialProofStats() {
  const stats = [
    { number: "45+", label: "Countries Covered" },
    { number: "10K+", label: "Community Members" },
    { number: "500+", label: "Stories Shared" },
    { number: "120+", label: "Destinations Reviewed" },
  ]

  return (
    <section className="bg-[#faf8f5] py-10 md:py-14">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-[#df4915] md:text-3xl lg:text-4xl">
                {stat.number}
              </p>
              <p className="mt-1 text-xs text-[#4b5563] md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
