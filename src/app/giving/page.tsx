import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { givingPageQuery, siteSettingsQuery } from "@/sanity/queries";
import type { GivingPage, SiteSettings } from "@/sanity/types";
import PortableTextRenderer from "@/components/PortableTextRenderer";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Give",
  description:
    "Support the mission of Hope Christian Church through your generous giving. Give online, by mail, or in person.",
};

export default async function GivingPage() {
  const [page, settings] = await Promise.all([
    client.fetch<GivingPage | null>(givingPageQuery),
    client.fetch<SiteSettings | null>(siteSettingsQuery),
  ]);

  const heroHeading = page?.heroHeading || "Give";
  const heroSub =
    page?.heroSubheading ||
    "Your generosity makes a difference. Together, we can further God's kingdom and serve our community.";
  const mainHeading = page?.mainHeading || "Support Our Mission";
  const givingLink = page?.givingLink || settings?.givingLink || "";
  const buttonLabel = page?.onlineGivingButtonLabel || "Give Online";
  const waysToGive = page?.waysToGive || [];
  const scriptureText = page?.scriptureText || "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.";
  const scriptureRef = page?.scriptureReference || "2 Corinthians 9:7";

  return (
    <>
      {/* Hero */}
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

      {/* Main Content */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
            Generosity
          </span>
          <h2 className="heading-lg accent-underline text-primary font-heading">
            {mainHeading}
          </h2>

          {page?.mainBody ? (
            <div className="mt-8 text-text-muted font-body leading-relaxed text-left">
              <PortableTextRenderer content={page.mainBody as any} />
            </div>
          ) : (
            <p className="mt-8 text-text-muted font-body leading-relaxed">
              Thank you for your heart to give. Your contributions support our
              worship services, community outreach, youth and children&apos;s
              ministries, and so much more. Every gift, no matter the size, helps
              us share the love of Christ with our neighbors.
            </p>
          )}

          {givingLink && (
            <a
              href={givingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-10 inline-flex text-base px-8 py-3"
            >
              {buttonLabel}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </section>

      {/* Ways to Give */}
      {waysToGive.length > 0 && (
        <section className="section-padding section-padding-y bg-bg-alt">
          <div className="container-wide">
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
                Options
              </span>
              <h2 className="heading-lg text-primary font-heading">
                Ways to Give
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {waysToGive.map(
                (way: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white p-8 shadow-sm text-center"
                  >
                    <h3 className="heading-sm text-primary font-heading mb-3">
                      {way.title}
                    </h3>
                    {way.description && (
                      <p className="text-text-muted font-body text-sm leading-relaxed">
                        {way.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Scripture */}
      <section className="section-padding section-padding-y bg-primary text-center">
        <div className="container-wide max-w-3xl">
          <blockquote className="font-heading text-xl md:text-2xl text-white/90 italic leading-relaxed">
            &ldquo;{scriptureText}&rdquo;
          </blockquote>
          <cite className="mt-6 block text-accent text-sm font-body not-italic font-semibold uppercase tracking-widest">
            {scriptureRef}
          </cite>
        </div>
      </section>
    </>
  );
}
