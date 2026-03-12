import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { notFound } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Static Params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.name,
    description: post.featuredSnippet,
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <div className="bg-bg min-h-screen">
      {/* ---- Hero Image ---- */}
      <section className="relative w-full h-[50vh] md:h-[60vh] min-h-[400px]">
        <Image
          src={post.imageUrl}
          alt={post.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/60 via-[#1a2332]/30 to-[#1a2332]/80" />

        {/* Back link */}
        <div className="absolute top-28 md:top-32 left-0 right-0 section-padding z-10">
          <div className="container-wide">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[0.9rem] font-medium transition-colors duration-300"
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
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-10 md:pb-14 z-10">
          <div className="container-wide max-w-4xl">
            <time
              dateTime={post.dateWritten}
              className="text-accent-light text-[0.8rem] font-semibold tracking-[0.15em] uppercase"
            >
              {formatDate(post.dateWritten)}
            </time>
            <h1 className="heading-lg text-white font-heading mt-2 text-balance">
              {post.name}
            </h1>
          </div>
        </div>
      </section>

      {/* ---- Article Content ---- */}
      <section className="section-padding section-padding-y">
        <div className="container-wide max-w-4xl">
          <article
            className="
              prose-article
              text-text text-[1.05rem] md:text-[1.1rem] leading-[1.8]
              [&>h2]:font-heading [&>h2]:text-primary [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:leading-snug
              [&>h3]:font-heading [&>h3]:text-primary [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:mt-10 [&>h3]:mb-4
              [&>p]:mb-6 [&>p]:text-text-muted
              [&>ul]:mb-6 [&>ul]:pl-0 [&>ul]:space-y-3
              [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:text-text-muted [&>ul>li]:leading-relaxed
              [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[10px]
              [&>ul>li]:before:w-2 [&>ul>li]:before:h-2 [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-accent/40
              [&>ol]:mb-6 [&>ol]:pl-6 [&>ol]:space-y-3 [&>ol]:list-decimal
              [&>ol>li]:text-text-muted [&>ol>li]:leading-relaxed [&>ol>li]:pl-2
              [&>blockquote]:my-10 [&>blockquote]:pl-8 [&>blockquote]:border-l-4 [&>blockquote]:border-accent
              [&>blockquote]:bg-accent/5 [&>blockquote]:rounded-r-xl [&>blockquote]:py-6 [&>blockquote]:pr-8
              [&>blockquote>p]:text-primary [&>blockquote>p]:font-heading [&>blockquote>p]:text-lg [&>blockquote>p]:md:text-xl
              [&>blockquote>p]:italic [&>blockquote>p]:leading-relaxed [&>blockquote>p]:mb-0
              [&_strong]:text-primary [&_strong]:font-semibold
              [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-accent-light [&_a]:transition-colors
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* ---- Related Posts ---- */}
      {relatedPosts.length > 0 && (
        <section className="section-padding pb-20 md:pb-28">
          <div className="container-wide max-w-4xl">
            <div className="border-t border-bg-alt pt-12">
              <h2 className="font-heading heading-md text-primary mb-8 accent-underline">
                Continue Reading
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group flex gap-5 bg-white rounded-xl p-4 shadow-[0_2px_16px_rgba(26,35,50,0.06)] hover:shadow-[0_6px_24px_rgba(26,35,50,0.1)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={rp.imageUrl}
                        alt={rp.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="120px"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <time
                        dateTime={rp.dateWritten}
                        className="text-[0.75rem] font-medium tracking-wide uppercase text-accent mb-1"
                      >
                        {formatDate(rp.dateWritten)}
                      </time>
                      <h3 className="font-heading text-primary text-base md:text-lg leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
                        {rp.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
