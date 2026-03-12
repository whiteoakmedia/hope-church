"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { SanitySermon } from "@/sanity/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/* ------------------------------------------------------------------ */
/*  Search Icon                                                        */
/* ------------------------------------------------------------------ */

function SearchIcon() {
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
      className="text-text-muted"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Play Icon                                                          */
/* ------------------------------------------------------------------ */

function PlayIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      <circle cx="24" cy="24" r="24" fill="rgba(200,149,62,0.9)" />
      <path d="M19 15L33 24L19 33V15Z" fill="white" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sermons Page Client Component                                      */
/* ------------------------------------------------------------------ */

export default function SermonsPageClient({
  sermons,
}: {
  sermons: SanitySermon[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSermons = useMemo(() => {
    if (!searchQuery.trim()) return sermons;
    const query = searchQuery.toLowerCase();
    return sermons.filter(
      (sermon) =>
        sermon.name.toLowerCase().includes(query) ||
        sermon.speaker.toLowerCase().includes(query)
    );
  }, [searchQuery, sermons]);

  const latestSermon = sermons[0];
  const previousSermons = filteredSermons.slice(
    searchQuery.trim() ? 0 : 1
  );

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
              Sermons
            </h1>
            <p className="body-lg text-white/70 max-w-2xl mx-auto">
              Watch and listen to messages from Hope Christian Church. Be
              encouraged, challenged, and inspired by the Word of God.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Latest Sermon                                                 */}
      {/* ============================================================ */}
      {latestSermon && (
        <section className="section-padding section-padding-y bg-bg">
          <div className="container-wide">
            <div className="mb-8">
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                Latest Message
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
              {/* Video embed */}
              <div className="lg:col-span-3">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(26,35,50,0.15)]">
                  <iframe
                    src={`https://www.youtube.com/embed/${latestSermon.youtubeVideoId}`}
                    title={latestSermon.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              {/* Sermon info */}
              <div className="lg:col-span-2 flex flex-col justify-center">
                <h2 className="font-heading heading-md text-primary mb-3">
                  {latestSermon.name}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-accent font-medium text-sm">
                    {latestSermon.speaker}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-text-light" />
                  <span className="text-text-muted text-sm">
                    {formatDate(latestSermon.datePreached)}
                  </span>
                </div>
                {latestSermon.description && (
                  <p className="body-lg text-text-muted leading-relaxed mb-6">
                    {latestSermon.description}
                  </p>
                )}
                <div className="flex gap-3">
                  <Link
                    href={`/sermons/${latestSermon.slug}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  <a
                    href={latestSermon.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  Previous Messages                                             */}
      {/* ============================================================ */}
      <section className="section-padding section-padding-y bg-bg-alt">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                Previous Messages
              </span>
              <h2 className="font-heading heading-lg text-primary mt-2">
                Sermon Archive
              </h2>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by title or speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-bg-alt bg-white text-text text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted transition-colors"
                  aria-label="Clear search"
                >
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
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Results count when searching */}
          {searchQuery.trim() && (
            <p className="text-text-muted text-sm mb-6">
              {previousSermons.length} result
              {previousSermons.length !== 1 ? "s" : ""} found for &ldquo;
              {searchQuery}&rdquo;
            </p>
          )}

          {/* Sermon grid */}
          {previousSermons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {previousSermons.map((sermon) => (
                <a
                  key={sermon.slug}
                  href={sermon.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(26,35,50,0.06)] hover:shadow-[0_8px_32px_rgba(26,35,50,0.12)] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-primary/5">
                    <img
                      src={`https://img.youtube.com/vi/${sermon.youtubeVideoId}/maxresdefault.jpg`}
                      alt={sermon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <PlayIcon />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading text-primary text-lg mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
                      {sermon.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-accent text-sm font-medium">
                        {sermon.speaker}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-light" />
                      <span className="text-text-muted text-xs">
                        {formatDate(sermon.datePreached)}
                      </span>
                    </div>
                    {sermon.description && (
                      <p className="text-text-muted text-sm leading-relaxed">
                        {truncate(sermon.description, 120)}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted body-lg">
                No sermons found matching your search.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-accent font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
