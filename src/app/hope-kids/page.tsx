import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hope Kids",
  description:
    "Hope Kids is the children's ministry of Hope Christian Church. A fun, safe, and engaging service designed just for kids to learn about Jesus.",
};

export default function HopeKidsPage() {
  return (
    <>
      {/* ================================================================ */}
      {/*  Hero Section                                                     */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f7e6a6] via-[#f9c5d1] to-[#a8d8ea] py-28 md:py-36">
        {/* Playful background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#fbd160]/40 blur-3xl" />
          <div className="absolute top-1/3 -right-16 w-80 h-80 rounded-full bg-[#f9a8d4]/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-[#7dd3fc]/30 blur-3xl" />
          {/* Small decorative circles */}
          <div className="absolute top-16 right-[15%] w-8 h-8 rounded-full bg-[#c8953e]/30" />
          <div className="absolute bottom-20 left-[10%] w-12 h-12 rounded-full bg-[#f472b6]/20" />
          <div className="absolute top-1/2 left-[5%] w-6 h-6 rounded-full bg-[#38bdf8]/30" />
          <div className="absolute top-24 left-[40%] w-10 h-10 rounded-full bg-[#fbbf24]/25" />
          <div className="absolute bottom-32 right-[25%] w-5 h-5 rounded-full bg-[#a78bfa]/30" />
        </div>

        <div className="section-padding relative z-10">
          <div className="container-wide flex flex-col items-center text-center">
            <div className="relative w-full max-w-xl mx-auto">
              <Image
                src="/Hope-Kids-Logo-1920x1080.png"
                alt="Hope Kids"
                width={1920}
                height={1080}
                className="w-full h-auto drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Content Section: A Service Just for Kids                         */}
      {/* ================================================================ */}
      <section className="section-padding section-padding-y bg-[#faf8f5]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <h2 className="font-heading heading-lg text-[#1a2332] mb-6">
                A service just for kids!
              </h2>
              <div className="space-y-4 text-[#6b6561] body-lg">
                <p>
                  At Hope Kids, we believe that children are never too young to
                  experience the love of God. Our children&apos;s ministry is
                  designed to be fun, engaging, and Christ-centered, helping kids
                  build a strong foundation of faith.
                </p>
                <p>
                  During our Sunday service, kids stay with their families in the
                  adult service through worship and offering. After offering, children
                  are dismissed to their own special service where they enjoy
                  age-appropriate Bible teaching, exciting games, creative activities,
                  and hands-on crafts that bring the lessons to life.
                </p>
                <p>
                  Every week is a new adventure as your kids discover more about
                  God&apos;s Word in a safe, welcoming, and fun environment!
                </p>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(26,35,50,0.12)]">
              <Image
                src="/Kids-Church-Erika-Giraud.jpg"
                alt="Children enjoying Hope Kids ministry"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Dark Section: Diving Deeper                                      */}
      {/* ================================================================ */}
      <section className="bg-[#1a2332] text-white section-padding section-padding-y">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <h2 className="font-heading heading-lg text-white mb-6">
            Helping Kids Dive Deeper into the Bible&apos;s Truths
          </h2>
          <p className="text-white/70 body-lg leading-relaxed">
            Our heart is to cultivate a lifelong love of Scripture in every child.
            Through Bible Engagement, kids don&apos;t just learn stories &mdash; they
            discover how to interact with God&apos;s Word personally, ask meaningful
            questions, and apply biblical truths to their everyday lives. We want every
            child to know that the Bible is alive, powerful, and written for them.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Curriculum Section                                               */}
      {/* ================================================================ */}
      <section className="section-padding section-padding-y bg-[#faf8f5]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: YouTube Embed */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(26,35,50,0.12)] bg-black">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/C1_HdY6ODhE"
                  title="Hope Kids Curriculum Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right: Text */}
            <div>
              <h2 className="font-heading heading-lg text-[#1a2332] mb-6">
                Our Curriculum
              </h2>
              <div className="space-y-4 text-[#6b6561] body-lg">
                <p>
                  We use the <strong>Learn</strong> curriculum from the Bible
                  Engagement Project, a dynamic and research-backed program built to
                  help kids genuinely engage with Scripture. Each lesson is crafted to
                  be interactive, memorable, and rooted in the truth of God&apos;s Word.
                </p>
                <p>
                  Through creative storytelling, guided discussion, and hands-on
                  exploration, children develop habits of reading, understanding,
                  and applying the Bible in ways that stick with them for life.
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="https://bibleengagementproject.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Learn More
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
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
