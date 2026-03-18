import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { eventsQuery, eventsPageQuery } from "@/sanity/queries";
import type { Event, EventsPage } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming events, gatherings, and activities at Hope Christian Church in North Haven, CT. Join us for fellowship, worship, and community outreach.",
  openGraph: {
    title: "Events",
    description:
      "Discover upcoming events, gatherings, and activities at Hope Christian Church in North Haven, CT.",
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatEventDate(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (endTime) {
    const end = new Date(endTime);
    // Same month
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} - ${end.toLocaleDateString("en-US", { weekday: "long", day: "numeric", year: "numeric" })}`;
    }
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  }

  return start.toLocaleDateString("en-US", options);
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Icon Components                                                    */
/* ------------------------------------------------------------------ */

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Events Page                                                        */
/* ------------------------------------------------------------------ */

export default async function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function descriptionToString(desc: any): string {
    if (!desc) return "";
    if (typeof desc === "string") return desc;
    if (Array.isArray(desc)) {
      return desc
        .filter((b: { _type?: string }) => b._type === "block")
        .map((b: { children?: { text?: string }[] }) =>
          (b.children || []).map((c) => c.text || "").join("")
        )
        .join(" ");
    }
    return "";
  }

  const [allEvents, eventsPage] = await Promise.all([
    client.fetch<Event[]>(eventsQuery),
    client.fetch<EventsPage | null>(eventsPageQuery),
  ]);
  const upcomingEvents = getUpcomingEvents(allEvents);
  const pastEvents = getPastEvents(allEvents);

  const heroHeading = eventsPage?.heroHeading || "Events";
  const heroSub = eventsPage?.heroSubheading || "Join us for fellowship, worship, and community. There is always something happening at Hope Christian Church.";

  return (
    <>
      {/* ============================================================ */}
      {/*  Hero Section                                                  */}
      {/* ============================================================ */}
      <section className="relative bg-primary pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className="relative section-padding">
          <div className="container-wide text-center">
            <h1 className="font-heading heading-xl text-white mb-4">
              {heroHeading}
            </h1>
            <p className="body-lg text-white/70 max-w-2xl mx-auto">
              {heroSub}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Upcoming Events                                               */}
      {/* ============================================================ */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide">
          <div className="mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              Upcoming
            </span>
            <h2 className="font-heading heading-lg text-primary mt-2">
              Upcoming Events
            </h2>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.slug}
                  className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(26,35,50,0.06)] hover:shadow-[0_8px_32px_rgba(26,35,50,0.12)] transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                    {/* Event image */}
                    <div className="md:col-span-2 relative aspect-[16/10] md:aspect-auto overflow-hidden">
                      <img
                        src={event.image ? urlFor(event.image).url() : ""}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category badge */}
                      {event.category && (
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#5B8DEF] text-white text-xs font-semibold uppercase tracking-wide">
                            {event.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event details */}
                    <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                      <h3 className="font-heading heading-sm text-primary mb-3 group-hover:text-accent transition-colors duration-200">
                        {event.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-text-muted text-sm">
                          <CalendarIcon className="text-accent shrink-0" />
                          <span>{formatEventDate(event.date, event.endDate ?? undefined)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-text-muted text-sm">
                          <MapPinIcon className="text-accent shrink-0 mt-0.5" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-text-muted leading-relaxed mb-6">
                          {descriptionToString(event.description)}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {event.slug && (
                          <Link
                            href={`/events/${event.slug}`}
                            className="btn btn-outline text-sm"
                          >
                            View Details
                            <ArrowRightIcon />
                          </Link>
                        )}
                        {event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary text-sm"
                          >
                            Register
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-[0_2px_12px_rgba(26,35,50,0.06)]">
              <div className="mb-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-text-light"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              <h3 className="font-heading heading-sm text-primary mb-2">
                Check Back Soon!
              </h3>
              <p className="text-text-muted body-lg max-w-md mx-auto">
                We are always planning new events and activities. Check back
                soon or follow us on social media for updates.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Past Events                                                   */}
      {/* ============================================================ */}
      {pastEvents.length > 0 && (
        <section className="section-padding section-padding-y bg-bg-alt">
          <div className="container-wide">
            <div className="mb-8">
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                Archive
              </span>
              <h2 className="font-heading heading-md text-primary mt-2">
                Past Events
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(26,35,50,0.06)] hover:shadow-[0_8px_32px_rgba(26,35,50,0.12)] transition-all duration-300 hover:-translate-y-1 opacity-80 hover:opacity-100"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={event.image ? urlFor(event.image).url() : ""}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[30%] group-hover:grayscale-0"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-primary/80 text-white/80 text-xs font-medium">
                        Past Event
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading text-primary text-lg mb-2 group-hover:text-accent transition-colors duration-200">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
                      <CalendarIcon className="text-text-light shrink-0" />
                      <span>{formatShortDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                      <MapPinIcon className="text-text-light shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
