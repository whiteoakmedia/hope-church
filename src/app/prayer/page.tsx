import Image from "next/image";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/image";
import type { Ministry } from "@/sanity/types";

export const revalidate = 30;

const prayerQuery = `*[_type == "ministry" && slug.current == "prayer"][0]{
  name,
  description[]{ ..., markDefs[]{ ... } },
  schedule,
  image{
    asset->{ _id, url, metadata { dimensions, lqip } },
    hotspot,
    crop,
    alt
  },
  contactEmail
}`;

export const metadata: Metadata = {
  title: "Prayer",
  description:
    "Prayer is the DNA of every ministry at Hope Christian Church. Submit a prayer request or learn about our prayer gatherings and intercessory ministry in North Haven, CT.",
  openGraph: {
    title: "Prayer",
    description:
      "Prayer is the DNA of every ministry at Hope Christian Church. Submit a prayer request or learn about our prayer ministry.",
  },
};

export default async function PrayerPage() {
  const prayer = await client
    .fetch<Ministry | null>(prayerQuery)
    .catch(() => null);

  const title = prayer?.name || "Prayer";
  const contactEmail = prayer?.contactEmail || "pastorjim@hopeag.com";
  const prayerImage = prayer?.image?.asset
    ? urlFor(prayer.image).width(800).height(1000).url()
    : null;
  const imageAlt = prayer?.image?.alt || "Hands folded in prayer";
  const imageLqip = prayer?.image?.asset?.metadata?.lqip;

  return (
    <>
      {/* ================================================================ */}
      {/*  Hero / Content Section                                           */}
      {/* ================================================================ */}
      <section className="section-padding bg-[#faf8f5] pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <p className="text-[#c8953e] font-medium text-sm tracking-[0.1em] uppercase mb-4">
                Spirit Empowered
              </p>
              <h1 className="font-heading heading-xl text-[#1a2332] mb-6">
                {title}
              </h1>

              <div className="space-y-5 text-[#6b6561] body-lg">
                {prayer?.description ? (
                  <PortableText value={prayer.description} />
                ) : (
                  <>
                    <p>
                      At Hope Christian Church, we believe that nothing of lasting
                      significance happens apart from prayer. As the Scripture says,
                      &ldquo;Not by might nor by power, but by My Spirit, says the LORD
                      of hosts&rdquo; (Zechariah 4:6). We depend on the power of the
                      Holy Spirit in everything we do, and prayer is how we access
                      that power.
                    </p>

                    <blockquote className="border-l-4 border-[#c8953e] pl-6 py-2 my-6 bg-[#f0ece4]/50 rounded-r-lg">
                      <p className="text-[#1a2332] font-heading text-xl md:text-2xl italic leading-relaxed">
                        &ldquo;Call upon Me in the day of trouble; I will deliver you,
                        and you shall glorify Me.&rdquo;
                      </p>
                      <cite className="block mt-3 text-[#c8953e] font-medium text-sm not-italic tracking-wide">
                        &mdash; Psalm 50:15 (NKJV)
                      </cite>
                    </blockquote>

                    <p>
                      Prayer is the DNA of every ministry at Hope. From our Sunday
                      services to our small groups, from our outreach efforts to our
                      daily walk with Christ &mdash; everything is bathed in prayer. We
                      believe that when God&apos;s people pray, God moves in powerful
                      and transformative ways.
                    </p>

                    <p>
                      Do you have a prayer request? We would be honored to pray with
                      you and for you. Our pastoral team and prayer partners are ready
                      to lift your needs before the Lord. No request is too big or too
                      small &mdash; God cares about every detail of your life.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-8">
                <a
                  href={`mailto:${contactEmail}`}
                  className="btn btn-primary"
                >
                  Submit a Prayer Request
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(26,35,50,0.12)]">
              <Image
                src={prayerImage || "/Gospel-Praying-Hands.jpg"}
                alt={imageAlt}
                width={800}
                height={1000}
                className="w-full h-auto object-cover"
                priority
                {...(imageLqip
                  ? { placeholder: "blur" as const, blurDataURL: imageLqip }
                  : {})}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
