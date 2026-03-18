import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { blogPostsQuery } from "@/sanity/queries";
import type { SanityBlogPost } from "@/sanity/types";

export const revalidate = 30;

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Chaplain's Blog",
  description:
    "Read the latest reflections, devotionals, and encouragement from our pastor and chaplain at Hope Christian Church in North Haven, Connecticut.",
  openGraph: {
    title: "Chaplain's Blog",
    description:
      "Read the latest reflections, devotionals, and encouragement from our pastor and chaplain at Hope Christian Church.",
  },
};

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
/*  Blog Card                                                          */
/* ------------------------------------------------------------------ */

function BlogCard({ post }: { post: SanityBlogPost }) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(26,35,50,0.06)] hover:shadow-[0_8px_40px_rgba(26,35,50,0.12)] transition-all duration-500 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332]/30 to-transparent" />
        </div>
      </Link>
      <div className="p-6 md:p-8">
        <time
          dateTime={post.dateWritten}
          className="text-[0.8rem] font-medium tracking-wide uppercase text-accent"
        >
          {formatDate(post.dateWritten)}
        </time>
        <h3 className="font-heading text-primary text-xl md:text-2xl mt-2 mb-3 leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-accent transition-colors duration-300"
          >
            {post.name}
          </Link>
        </h3>
        <p className="text-text-muted text-[0.95rem] leading-relaxed line-clamp-3 mb-5">
          {post.featuredSnippet}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-accent font-semibold text-[0.9rem] group/link hover:gap-3 transition-all duration-300"
        >
          Read More
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover/link:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function BlogPage() {
  const blogPosts = await client.fetch<SanityBlogPost[]>(blogPostsQuery);

  const featuredPost = blogPosts.find((p) => p.featuredOnHome);
  const remainingPosts = blogPosts.filter((p) => p !== featuredPost);

  return (
    <div className="bg-bg min-h-screen">
      {/* ---- Hero ---- */}
      <section className="relative bg-primary pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,149,62,0.15)_0%,_transparent_60%)]" />
        <div className="section-padding relative z-10">
          <div className="container-wide text-center">
            <span className="inline-block text-accent text-[0.8rem] font-semibold tracking-[0.2em] uppercase mb-4">
              Reflections &amp; Devotionals
            </span>
            <h1 className="heading-xl text-white font-heading text-balance">
              Chaplain&apos;s Blog
            </h1>
            <p className="mt-4 text-white/60 body-lg max-w-2xl mx-auto text-balance">
              Words of encouragement, faith, and hope from our pastor and
              chaplain.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Featured Post ---- */}
      {featuredPost && (
        <section className="section-padding -mt-12 md:-mt-16 relative z-10">
          <div className="container-wide">
            <article className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_48px_rgba(26,35,50,0.1)]">
              <div className="grid md:grid-cols-2 gap-0">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="block relative aspect-[4/3] md:aspect-auto overflow-hidden"
                >
                  <Image
                    src={featuredPost.imageUrl}
                    alt={featuredPost.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/20 to-transparent" />
                </Link>
                <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                  <span className="inline-block self-start bg-accent/10 text-accent text-[0.75rem] font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-4">
                    Featured
                  </span>
                  <time
                    dateTime={featuredPost.dateWritten}
                    className="text-[0.8rem] font-medium tracking-wide uppercase text-text-muted mb-2"
                  >
                    {formatDate(featuredPost.dateWritten)}
                  </time>
                  <h2 className="font-heading text-primary heading-md mb-4 leading-snug">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="hover:text-accent transition-colors duration-300"
                    >
                      {featuredPost.name}
                    </Link>
                  </h2>
                  <p className="text-text-muted body-lg mb-8 line-clamp-4">
                    {featuredPost.featuredSnippet}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="btn btn-primary self-start"
                  >
                    Read Article
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ---- Post Grid ---- */}
      <section className="section-padding section-padding-y">
        <div className="container-wide">
          <h2 className="font-heading heading-md text-primary mb-10 accent-underline">
            All Posts
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {remainingPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
