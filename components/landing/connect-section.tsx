/**
 * Connect Section
 * 
 * Community stats and upcoming events
 * Accepts props for future Supabase integration
 */

interface CommunityStats {
  active_members: number;
  countries: number;
  stories_shared: number;
  connections_made: number;
}

interface Event {
  id: string;
  title: string;
  type: 'Virtual' | 'In-Person';
  date: string;
  location?: string;
  attending_count: number;
  image?: string;
}

interface ConnectSectionProps {
  stats?: CommunityStats;
  events?: Event[];
}

const DEFAULT_STATS: CommunityStats = {
  active_members: 10000,
  countries: 152,
  stories_shared: 5891,
  connections_made: 15432,
};

const DEFAULT_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Solo Travel Safety Workshop',
    type: 'Virtual',
    date: 'Mar 15',
    attending_count: 156,
  },
  {
    id: '2',
    title: 'Community Meetup: Central Park',
    type: 'In-Person',
    date: 'Mar 22',
    location: 'Central Park, NY',
    attending_count: 42,
  },
  {
    id: '3',
    title: 'Budget Travel Planning Session',
    type: 'Virtual',
    date: 'Apr 5',
    attending_count: 89,
  },
];

export function ConnectSection({ stats = DEFAULT_STATS, events = DEFAULT_EVENTS }: ConnectSectionProps) {
  return (
    <section id="connect" className="py-20 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <p className="eyebrow-text text-center mb-3">Community</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Join Our Growing Community
        </h2>
        <p className="narrative-interlude mb-12">
          Connect with thousands of solo travelers sharing their journeys and supporting each other.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-brand-blue1 mb-2">
              {stats.active_members.toLocaleString()}+
            </div>
            <div className="text-neutral-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-brand-blue1 mb-2">
              {stats.countries}
            </div>
            <div className="text-neutral-600">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-brand-blue1 mb-2">
              {stats.stories_shared.toLocaleString()}+
            </div>
            <div className="text-neutral-600">Stories Shared</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-brand-blue1 mb-2">
              {stats.connections_made.toLocaleString()}+
            </div>
            <div className="text-neutral-600">Connections Made</div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="surface-card rounded-2xl overflow-hidden lift-hover"
              >
                {event.image && (
                  <div className="aspect-video postcard-media flex items-center justify-center">
                    <span className="text-neutral-400 text-xs uppercase tracking-wider">Event Image</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-yellow1 text-black px-2 py-1 rounded text-xs font-semibold">
                      {event.type}
                    </span>
                    <span className="text-sm text-neutral-500">{event.date}</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-neutral-900">{event.title}</h4>
                  {event.location && (
                    <p className="text-sm text-neutral-600 mb-3">{event.location}</p>
                  )}
                  <p className="text-sm text-neutral-500">
                    {event.attending_count} attending
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

