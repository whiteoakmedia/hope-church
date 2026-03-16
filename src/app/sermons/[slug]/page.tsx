import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import {
  sermonBySlugQuery,
  sermonSlugsQuery,
  sermonsQuery,
} from "@/sanity/queries";
import type { Sermon } from "@/sanity/types";

/* ------------------------------------------------------------------ */
/*  Helper – extract YouTube video ID from a URL                       */
/* ------------------------------------------------------------------ */
function getYouTubeId(url: string): string {
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
/*  Static Params                                                      */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(sermonSlugsQuery);
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
  const sermon = await client.fetch<Sermon | null>(
    sermonBySlugQuery,
    { slug }
  );
  if (!sermon) return { title: "Sermon Not Found" };

  const descText = descriptionToString(sermon.description);
  return {
    title: sermon.title,
    description:
      descText ||
      `Watch "${sermon.title}" by ${sermon.preacher?.name || "Unknown"}`,
    openGraph: {
      title: sermon.title,
      description:
        descText ||
        `Watch "${sermon.title}" by ${sermon.preacher?.name || "Unknown"}`,
      type: "article",
      images: [
        {
          url: `https://img.youtube.com/vi/${getYouTubeId(sermon.videoUrl || "")}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
        },
      ],
    },
  };
}

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

/* ------------------------------------------------------------------ */
/*  Arrow Left Icon                                                    */
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

/* ------------------------------------------------------------------ */
/*  Sermon Detail Page                                                 */
/* ------------------------------------------------------------------ */

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sermon = await client.fetch<Sermon | null>(
    sermonBySlugQuery,
    { slug }
  );

  if (!sermon) {
    notFound();
  }

  // Get 3 related sermons (excluding the current one)
  const allSermons = await client.fetch<Sermon[]>(sermonsQuery);
  const relatedSermons = allSermons
    .filter((s) => s.slug !== sermon.slug)
    .slice(0, 3);

  return (
    <>
      {/* ============================================================ */}
      {/*  Hero / Back Navigation                                        */}
      {/* ============================================================ */}
      <section className="bg-primary pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="section-padding">
          <div className="container-wide">
            <Link
              href="/sermons"
              className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors text-sm font-medium"
            >
              <ArrowLeftIcon />
              Back to Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Main Content                                                  */}
      {/* ============================================================ */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide max-w-5xl mx-auto">
          {/* Video embed */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(26,35,50,0.15)] mb-8">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(sermon.videoUrl || "")}`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Sermon info */}
          <div className="mb-12">
            <h1 className="font-heading heading-lg text-primary mb-4">
              {sermon.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-accent font-medium">
                  {sermon.preacher?.name || "Unknown"}
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-text-light" />
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-muted"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
                <span className="text-text-muted">
                  {formatDate(sermon.date)}
                </span>
              </div>
            </div>

            {sermon.description && (
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_12px_rgba(26,35,50,0.06)]">
                <p className="body-lg text-text-muted leading-relaxed">
                  {descriptionToString(sermon.description)}
                </p>
              </div>
            )}

            <div className="mt-6">
              <a
                href={sermon.videoUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Related Sermons                                               */}
      {/* ============================================================ */}
      {relatedSermons.length > 0 && (
        <section className="section-padding section-padding-y bg-bg-alt">
          <div className="container-wide max-w-5xl mx-auto">
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              Keep Listening
            </span>
            <h2 className="font-heading heading-md text-primary mt-2 mb-8">
              More Messages
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSermons.map((related) => (
                <Link
                  key={related.slug}
                  href={`/sermons/${related.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(26,35,50,0.06)] hover:shadow-[0_8px_32px_rgba(26,35,50,0.12)] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-primary/5">
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(related.videoUrl || "")}/maxresdefault.jpg`}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading text-primary text-lg mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-accent text-sm font-medium">
                        {related.preacher?.name || ""}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-light" />
                      <span className="text-text-muted text-xs">
                        {formatDate(related.date)}
                      </span>
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
