import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

/* ------------------------------------------------------------------ */
/*  Custom Portable Text Components                                    */
/* ------------------------------------------------------------------ */

const components = {
  types: {
    image: ({
      value,
    }: {
      value: { asset: { _ref: string }; alt?: string };
    }) => {
      const url = urlFor(value).width(1200).auto("format").url();
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt || ""}
            width={1200}
            height={675}
            className="rounded-xl w-full h-auto"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-text-light mt-3">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { href?: string };
    }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-accent underline underline-offset-2 hover:text-accent-light transition-colors"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Portable Text Renderer                                             */
/* ------------------------------------------------------------------ */

export default function PortableTextRenderer({
  content,
}: {
  content: PortableTextBlock[];
}) {
  return (
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
      "
    >
      <PortableText value={content} components={components} />
    </article>
  );
}
