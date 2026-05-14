import Link from 'next/link'

import { HomepageInterestForm } from '@/components/home/homepage-interest-form'

const newsletterBenefits = [
  'Hand-picked Solo SHE reads and rituals we’re polishing for the roadmap',
  'Safety-forward travel reflections you can tuck into carry-on bravery',
  'Transparent platform notes—we only email when something is genuinely worth sending',
]

export function NewsletterSection() {
  return (
    <section className="bg-[#f7e8be] py-16 md:py-24">
      <div className="container mx-auto shell-inline">
        <div className="editorial-card-strong overflow-hidden rounded-[2.5rem]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[#7a331b] px-8 py-10 text-[#fff5df] md:px-10 md:py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Stay in the loop</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Quiet notes about what we&apos;re building for solo women on the road.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#fff5df]/82">
                Add your email if you want us to remember you for future updates. We keep the copy honest: no automated
                newsletter blasts ship from this app yet—this is a working interest list for when we do.
              </p>

              <div className="mt-8 space-y-3">
                {newsletterBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-[1.25rem] bg-white/8 px-4 py-3 text-sm leading-6">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#fab642]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fffaf0] px-8 py-10 md:px-10 md:py-12">
              <div className="mx-auto max-w-xl">
                <p className="eyebrow text-sm tracking-[0.2em]">Interest list + member access</p>
                <h3 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] md:text-4xl">
                  Save your email here, or create a profile for the full member experience.
                </h3>
                <p className="mt-4 text-base leading-7 text-[#6d5849]">
                  Submitting this form stores your address in our Supabase project so operators can export or sync it to a
                  future email provider. You will <span className="font-semibold">not</span> receive transactional or
                  marketing email from SoloSheThings until we configure sending—nothing is silently promised in the inbox.
                  Prefer chatting first? The contact link is right below alongside signup.
                </p>

                <div className="editorial-card mt-6 rounded-[2rem] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a14b24]">Save contact interest</p>
                  <p className="mt-2 text-sm leading-6 text-[#6d5849]">
                    One submission per inbox is enough—we refresh the timestamp when you repeat.
                  </p>
                  <HomepageInterestForm
                    source="homepage_newsletter"
                    formLabel="Email for SoloSheThings interest updates"
                  />
                </div>

                <div className="editorial-card mt-6 rounded-[2rem] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a14b24]">Already decided?</p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href="/signup"
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e34b16] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c74010]"
                    >
                      Create your profile
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#7a331b] transition hover:border-[#e34b16]/45 hover:text-[#e34b16]"
                    >
                      Contact the team
                    </Link>
                  </div>
                </div>

                <p className="mt-5 text-xs leading-5 text-[#6d5849]/90">
                  Operations note for staff: interest rows live in the Supabase marketing-interest table; admins can read
                  them alongside exports (see docs/contracts/EMAIL_NOTIFICATIONS_CONTRACT.md). Connecting Resend or a
                  newsletter provider is deliberate follow-up work.
                </p>
              </div>
            </div>
            </div>
        </div>
      </div>
    </section>
  )
}
