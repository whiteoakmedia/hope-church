import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import {
  EVENT_BY_SLUG_QUERY,
  EVENT_SLUGS_QUERY,
} from "@/sanity/queries";
import type { SanityEvent } from "@/sanity/types";

/* ------------------------------------------------------------------ */
/*  Static Params                                                      */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(EVENT_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}

/* ------------------------------------------------------------------ */
/*  Dynamic Metadata                                                   */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch<SanityEvent | null>(EVENT_BY_SLUG_QUERY, {
    slug,
  });
  if (!event) return { title: "Event Not Found" };

  return {
    title: event.name,
    description: event.description || `${event.name} at ${event.location}`,
    openGraph: {
      title: event.name,
      description: event.description || `${event.name} at ${event.location}`,
      type: "article",
      images: event.imageUrl
        ? [{ url: event.imageUrl, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

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
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${start.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  }

  return start.toLocaleDateString("en-US", options);
}

/**
 * Extract YouTube video ID from various URL formats.
 */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/* ------------------------------------------------------------------ */
/*  Icon Components                                                    */
/* ------------------------------------------------------------------ */

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
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
      width="20"
      height="20"
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

/* ------------------------------------------------------------------ */
/*  Event Detail Page                                                  */
/* ------------------------------------------------------------------ */

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await client.fetch<SanityEvent | null>(EVENT_BY_SLUG_QUERY, {
    slug,
  });

  if (!event) {
    notFound();
  }

  const promoVideoId = event.promoVideo
    ? extractYouTubeId(event.promoVideo)
    : null;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startTime,
    endDate: event.endTime || event.startTime,
    image: event.imageUrl,
    location: {
      "@type": "Place",
      name: event.location,
    },
    organizer: {
      "@type": "Organization",
      name: "Hope Christian Church",
      url: "https://hopeag.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {/* ============================================================ */}
      {/*  Hero / Back Navigation                                        */}
      {/* ============================================================ */}
      <section className="bg-primary pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="section-padding">
          <div className="container-wide">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors text-sm font-medium"
            >
              <ArrowLeftIcon />
              Back to Events
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Main Content                                                  */}
      {/* ============================================================ */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* ---- Left column: Image ---- */}
            <div className="lg:col-span-3">
              {/* Event image */}
              <div className="relative rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(26,35,50,0.15)] mb-8">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-auto object-cover"
                />
                {/* Badges */}
                {(event.isKids || event.isYouth) && (
                  <div className="absolute top-4 left-4 flex gap-2">
                    {event.isKids && (
                      <span className="px-3 py-1 rounded-full bg-[#5B8DEF] text-white text-xs font-semibold uppercase tracking-wide shadow-lg">
                        Kids Event
                      </span>
                    )}
                    {event.isYouth && (
                      <span className="px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-xs font-semibold uppercase tracking-wide shadow-lg">
                        Youth Event
                      </span>
                    )}
                  </div>
                )}
                {event.archived && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-primary/80 text-white/80 text-xs font-semibold uppercase tracking-wide">
                      Past Event
                    </span>
                  </div>
                )}
              </div>

              {/* Promo video */}
              {promoVideoId && (
                <div className="mb-8">
                  <h3 className="font-heading heading-sm text-primary mb-4">
                    Event Preview
                  </h3>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(26,35,50,0.15)]">
                    <iframe
                      src={`https://www.youtube.com/embed/${promoVideoId}`}
                      title={`${event.name} - Preview`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ---- Right column: Details ---- */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <h1 className="font-heading heading-lg text-primary mb-6">
                  {event.name}
                </h1>

                {/* Info card */}
                <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(26,35,50,0.06)] mb-6">
                  <div className="space-y-4">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <CalendarIcon className="text-accent" />
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-text-light font-medium block mb-0.5">
                          Date
                        </span>
                        <span className="text-text font-medium text-sm">
                          {formatEventDate(event.startTime, event.endTime)}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <MapPinIcon className="text-accent" />
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-text-light font-medium block mb-0.5">
                          Location
                        </span>
                        <span className="text-text font-medium text-sm">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(26,35,50,0.06)] mb-6">
                    <h3 className="font-heading text-primary text-lg mb-3">
                      About This Event
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Register button */}
                {event.registerLink && !event.archived && (
                  <a
                    href={event.registerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full text-center text-base py-4"
                  >
                    Register for This Event
                    <svg
                      width="18"
                      height="18"
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
                  </a>
                )}

                {event.archived && (
                  <div className="bg-bg-alt rounded-xl p-4 text-center">
                    <p className="text-text-muted text-sm">
                      This event has already taken place.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
