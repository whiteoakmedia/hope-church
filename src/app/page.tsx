import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import {
  sermonsQuery,
  eventsQuery,
  blogPostsQuery,
  siteSettingsQuery,
  homePageQuery,
} from "@/sanity/queries";
import type { Sermon, SanityBlogPost, Event, SiteSettings, HomePage } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import { getUpcomingEvents } from "@/lib/events";

export const revalidate = 30;

/* ------------------------------------------------------------------ */
/*  Helper – extract YouTube video ID from a URL                       */
/* ------------------------------------------------------------------ */
function getYouTubeId(url?: string | null): string {
  if (!url) return "";
  const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?]+)/);
  return match?.[1] || "";
}

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

/* ------------------------------------------------------------------ */
/*  Helper – format a date string nicely                               */
/* ------------------------------------------------------------------ */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Home Page                                                          */
/* ------------------------------------------------------------------ */
export default async function Home() {
  const [sermons, allEvents, blogPosts, settings, homePage] = await Promise.all([
    client.fetch<Sermon[]>(sermonsQuery),
    client.fetch<Event[]>(eventsQuery),
    client.fetch<SanityBlogPost[]>(blogPostsQuery),
    client.fetch<SiteSettings | null>(siteSettingsQuery),
    client.fetch<HomePage | null>(homePageQuery),
  ]);

  const latestSermon = sermons[0];
  const upcomingEvents = getUpcomingEvents(allEvents).slice(0, 3);
  const featuredPosts = blogPosts.filter((p) => p.featuredOnHome);

  // Use homePage / settings or sensible defaults
  const heroHeading = homePage?.heroHeading || "Join Us for Service!";
  const heroSubtext =
    homePage?.heroSubheading ||
    "We gather each Sunday at 10am & Wednesdays at 7pm. There is a place here for everyone!";
  const sundayTime = settings?.serviceTimes?.find((t) => t.dayOfWeek === "Sunday")?.time || "10:00 AM";
  const wednesdayTime = settings?.serviceTimes?.find((t) => t.dayOfWeek === "Wednesday")?.time || "7:00 PM";
  // CTA data — look for a "cta" section in the homePage sections array, fallback to defaults
  const ctaSection = homePage?.sections?.find((s) => s.sectionType === "cta");
  const ctaHeading = ctaSection?.heading || "We'd Love to Meet You";
  const ctaBody = ctaSection?.body || null;
  const ctaSubtextFallback =
    "Whether you are new to faith or have been walking with God for years, there is a place for you at Hope Christian Church. Come as you are and discover a community that feels like family.";

  return (
    <>
      {/* ============================================================
          1. HERO SECTION
          ============================================================ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src={homePage?.heroImage?.asset ? urlFor(homePage.heroImage).width(1920).quality(80).url() : "/ChatGPT-Facebook-Photo.jpg"}
          alt="Hope Christian Church worship service"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/70 via-[#1a2332]/50 to-[#1a2332]/90" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {/* Service time badges */}
          <div
            className="mb-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm font-body">
              <svg
                className="h-4 w-4 text-[#c8953e]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Sundays at {sundayTime}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm font-body">
              <svg
                className="h-4 w-4 text-[#c8953e]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Wednesdays at {wednesdayTime}
            </span>
          </div>

          {/* Heading */}
          <h1
            className="heading-xl max-w-4xl text-white animate-fade-in font-heading"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            {heroHeading}
          </h1>

          {/* Subtext */}
          <p
            className="body-lg mt-6 max-w-2xl text-white/80 text-balance animate-fade-in font-body"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            {heroSubtext}
          </p>

          {/* CTA buttons */}
          <div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in"
            style={{ animationDelay: "0.8s", animationFillMode: "both" }}
          >
            <Link href="/im-new" className="btn btn-primary px-8 py-3 text-base">
              I&apos;m New
            </Link>
            <Link
              href="/plan-your-visit"
              className="btn btn-outline-light px-8 py-3 text-base"
            >
              Plan Your Visit
            </Link>
          </div>

          {/* Scroll indicator */}
          <div
            className="mt-16 animate-fade-in"
            style={{ animationDelay: "1.2s", animationFillMode: "both" }}
          >
            <div className="flex flex-col items-center gap-2 text-white/40">
              <span className="text-xs uppercase tracking-widest font-body">
                Scroll
              </span>
              <svg
                className="h-5 w-5 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. WELCOME SECTION
          ============================================================ */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* YouTube embed */}
            <div className="animate-fade-in">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl shadow-primary/10">
                <iframe
                  src="https://www.youtube.com/embed/oMIh5wfADZg"
                  title="Welcome to Hope Christian Church"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            {/* Welcome text */}
            <div className="animate-fade-in">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
                Welcome Home
              </span>
              <h2 className="heading-lg accent-underline text-primary font-heading">
                {homePage?.welcomeHeading || "A Place for Everyone"}
              </h2>
              {homePage?.welcomeBody ? (
                <div className="mt-8 text-text-muted font-body leading-relaxed [&>p]:mb-4 [&>p:first-child]:text-lg">
                  <PortableText value={homePage.welcomeBody} />
                </div>
              ) : (
                <>
                  <p className="body-lg mt-8 text-text-muted font-body">
                    A praying and worshipping church where you will meet people from
                    all ages and backgrounds gathering together to encounter God.
                  </p>
                  <p className="mt-4 text-text-muted font-body leading-relaxed">
                    At Hope Christian Church in North Haven, CT, we believe that God
                    has a purpose for every person. Whether you are taking your first
                    steps of faith or have walked with God for decades, you will find
                    a warm, welcoming community ready to do life alongside you.
                  </p>
                </>
              )}
              <Link
                href="/what-we-believe"
                className="btn btn-primary mt-8 inline-flex"
              >
                About Us
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. LATEST SERMON SECTION
          ============================================================ */}
      {latestSermon && (
        <section className="section-padding section-padding-y bg-primary text-white">
          <div className="container-wide">
            {/* Section header */}
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
                Latest Message
              </span>
              <h2 className="heading-lg text-white font-heading">
                Watch the Latest Sermon
              </h2>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Video */}
              <div className="animate-fade-in">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(latestSermon.videoUrl)}`}
                    title={latestSermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>

              {/* Sermon info */}
              <div className="animate-fade-in">
                <p className="text-sm font-medium uppercase tracking-wider text-accent-light font-body">
                  {formatDate(latestSermon.date)}
                </p>
                <h3 className="heading-md mt-3 text-white font-heading">
                  {latestSermon.title}
                </h3>
                <p className="mt-2 text-base text-white/60 font-body">
                  {latestSermon.preacher?.name || "Unknown"}
                </p>
                <p className="mt-4 leading-relaxed text-white/75 font-body">
                  {descriptionToString(latestSermon.description)}
                </p>
                <Link
                  href="/sermons"
                  className="btn btn-primary mt-8 inline-flex"
                >
                  Watch More
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          4. EVENTS PREVIEW SECTION
          ============================================================ */}
      <section className="section-padding section-padding-y bg-bg-alt">
        <div className="container-wide">
          {/* Section header */}
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
              What&apos;s Happening
            </span>
            <h2 className="heading-lg text-primary font-heading">
              Upcoming Events
            </h2>
          </div>

          {/* Event cards */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, i) => (
              <Link
                key={event.slug || event._id || i}
                href={event.slug ? `/events/${event.slug}` : "/events"}
                className="group animate-fade-in overflow-hidden rounded-xl bg-white shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  animationDelay: `${0.15 * i}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Event image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(event.image).url()}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-6">
                  <h3 className="heading-sm text-primary font-heading leading-snug">
                    {event.title}
                  </h3>

                  <div className="mt-4 flex flex-col gap-2">
                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm text-text-muted font-body">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-start gap-2 text-sm text-text-muted font-body">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View all events */}
          <div className="mt-12 text-center">
            <Link href="/events" className="btn btn-outline inline-flex">
              More Events
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. BLOG PREVIEW SECTION
          ============================================================ */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide">
          {/* Section header */}
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
              From Our Blog
            </span>
            <h2 className="heading-lg text-primary font-heading">
              Stories of Faith
            </h2>
          </div>

          {/* Blog cards */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group animate-fade-in overflow-hidden rounded-xl bg-white shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  animationDelay: `${0.15 * i}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Blog image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card body */}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent font-body">
                    {formatDate(post.dateWritten)}
                  </p>
                  <h3 className="heading-sm mt-2 text-primary font-heading leading-snug">
                    {post.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted font-body line-clamp-3">
                    {post.featuredSnippet}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors group-hover:text-[#b8842e] font-body">
                    Read More
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View all posts */}
          <div className="mt-12 text-center">
            <Link href="/blog" className="btn btn-outline inline-flex">
              View All Posts
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. CTA SECTION
          ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Warm background with texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c8953e] via-[#b8842e] to-[#a87324]" />
        <div className="absolute inset-0 bg-[url('/Gospel-Praying-Hands.jpg')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 section-padding section-padding-y">
          <div className="container-wide text-center">
            <h2
              className="heading-lg max-w-3xl mx-auto text-white font-heading animate-fade-in"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              {ctaHeading}
            </h2>
            {ctaBody ? (
              <div
                className="body-lg mt-6 max-w-xl mx-auto text-white/85 text-balance font-body animate-fade-in [&>p]:mb-4 [&>p:last-child]:mb-0"
                style={{ animationDelay: "0.3s", animationFillMode: "both" }}
              >
                <PortableText value={ctaBody} />
              </div>
            ) : (
              <p
                className="body-lg mt-6 max-w-xl mx-auto text-white/85 text-balance font-body animate-fade-in"
                style={{ animationDelay: "0.3s", animationFillMode: "both" }}
              >
                {ctaSubtextFallback}
              </p>
            )}
            <div
              className="mt-10 animate-fade-in"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              <Link
                href="/plan-your-visit"
                className="btn inline-flex items-center gap-2 bg-white px-8 py-3 text-base font-semibold text-[#1a2332] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
              >
                Plan Your Visit
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
