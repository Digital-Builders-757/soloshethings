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
    rotate: "rotate-2",
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
    rotate: "-rotate-1",
  },
]

export function CommunityStories() {
  return (
    <section className="bg-brand-blue py-24">
      <div className="mx-auto max-w-[1240px] px-8">
        <h2 className="mb-16 text-center font-serif text-[3rem] font-bold italic text-white">
          Community Voices
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {voices.map((voice) => (
            <div
              key={voice.name}
              className={`flex min-h-[300px] flex-col justify-between rounded-3xl bg-brand-peach p-8 text-brand-blue transition-transform duration-200 hover:scale-[1.02] hover:rotate-1 ${voice.rotate}`}
            >
              {/* Avatar */}
              <div className="mb-4 h-[60px] w-[60px] overflow-hidden rounded-full bg-brand-orange">
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
              <p className="text-lg font-medium leading-snug">
                {`"${voice.quote}"`}
              </p>

              {/* Name */}
              <span className="mt-4 block text-[0.9rem] font-bold uppercase tracking-[1px]">
                {"— "}{voice.name}, {voice.age}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
