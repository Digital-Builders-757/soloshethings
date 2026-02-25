import Image from "next/image"

const voices = [
  {
    quote: "I never thought I could dine alone until I tried it in Tokyo. Now it's my favorite ritual.",
    name: "Sarah",
    age: 24,
    avatar: "https://i.pravatar.cc/150?u=1",
    rotate: "",
  },
  {
    quote: "The safety guides on SHE Things helped me navigate Cairo with total confidence.",
    name: "Amara",
    age: 31,
    avatar: "https://i.pravatar.cc/150?u=2",
    rotate: "md:rotate-2",
  },
  {
    quote: "Met my best friend through the solo meetup feature in Bali. Forever grateful!",
    name: "Jess",
    age: 28,
    avatar: "https://i.pravatar.cc/150?u=3",
    rotate: "",
  },
  {
    quote: "Solo travel isn't lonely. It's the most connected I've ever felt to the world.",
    name: "Elena",
    age: 35,
    avatar: "https://i.pravatar.cc/150?u=4",
    rotate: "md:-rotate-1",
  },
]

export function CommunityStories() {
  return (
    <section className="bg-brand-blue py-14 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <h2 className="mb-10 text-center font-serif text-2xl font-bold italic text-white sm:text-3xl md:mb-16 md:text-[3rem]">
          Community Voices
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {voices.map((voice) => (
            <div
              key={voice.name}
              className={`flex min-h-[240px] flex-col justify-between rounded-2xl bg-brand-peach p-6 text-brand-blue transition-transform duration-200 hover:scale-[1.02] hover:rotate-1 md:min-h-[300px] md:rounded-3xl md:p-8 ${voice.rotate}`}
            >
              {/* Avatar */}
              <div className="mb-3 h-[48px] w-[48px] overflow-hidden rounded-full bg-brand-orange md:mb-4 md:h-[60px] md:w-[60px]">
                <Image
                  src={voice.avatar}
                  alt={voice.name}
                  width={60}
                  height={60}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>

              {/* Quote */}
              <p className="text-base font-medium leading-snug md:text-lg">
                {`"${voice.quote}"`}
              </p>

              {/* Name */}
              <span className="mt-3 block text-[0.85rem] font-bold uppercase tracking-[1px] md:mt-4 md:text-[0.9rem]">
                {"— "}{voice.name}, {voice.age}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
