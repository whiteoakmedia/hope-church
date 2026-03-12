import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I'm New",
  description:
    "Welcome to Hope Christian Church! Learn what to expect on your first visit and discover a warm, Christ-centered community in North Haven, CT.",
};

export default function ImNewPage() {
  return (
    <>
      {/* ================================================================ */}
      {/*  Hero Section                                                     */}
      {/* ================================================================ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/ChatGPT-Facebook-Photo.jpg')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#1a2332]/70" />

        <div className="relative z-10 section-padding w-full py-32 md:py-44">
          <div className="container-wide text-center">
            <p className="text-[#c8953e] font-medium text-sm md:text-base tracking-[0.15em] uppercase mb-4 animate-fade-in">
              Real People. Real Hope. Real Life.
            </p>
            <h1 className="font-heading heading-xl text-white mb-6 animate-fade-in text-balance">
              Welcome to Hope Christian Church!
            </h1>
            <p className="text-white/70 body-lg max-w-2xl mx-auto animate-fade-in">
              We&apos;re so glad you&apos;re here. Whether you&apos;re exploring
              faith for the first time or looking for a new church home, you
              belong here.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Statement Section                                                */}
      {/* ================================================================ */}
      <section className="bg-[#faf8f5] section-padding py-16 md:py-20">
        <div className="container-wide max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#c8953e] rounded-full" />
            <p className="font-heading text-[#1a2332] text-2xl md:text-3xl lg:text-4xl leading-snug pt-6">
              We are passionate about reaching our community for the cause of Christ.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Welcome Video Section                                            */}
      {/* ================================================================ */}
      <section className="section-padding section-padding-y bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: YouTube Embed */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(26,35,50,0.12)] bg-black">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/oMIh5wfADZg"
                  title="Welcome to Hope Christian Church"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right: Text */}
            <div>
              <h2 className="font-heading heading-lg text-[#1a2332] mb-6">
                Welcome to Hope
              </h2>
              <div className="space-y-4 text-[#6b6561] body-lg">
                <p>
                  Hope Christian Church is more than a building &mdash; it&apos;s a
                  family. We are a community of real people who have found real
                  hope in Jesus Christ, and we&apos;d love for you to experience
                  that same hope.
                </p>
                <p>
                  From the moment you walk through our doors, you&apos;ll be
                  greeted by friendly faces and a warm atmosphere. Our services
                  are designed to be uplifting, relevant, and Christ-centered,
                  with worship, prayer, and practical Bible teaching that you can
                  apply to your everyday life.
                </p>
                <p>
                  Whether you&apos;re new to faith or have been walking with Jesus
                  for years, there&apos;s a place for you at Hope.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/what-we-believe" className="btn btn-primary">
                  About Us
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Visit / Map Section                                              */}
      {/* ================================================================ */}
      <section className="section-padding section-padding-y bg-[#faf8f5]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <p className="text-[#c8953e] font-medium text-sm tracking-[0.1em] uppercase mb-4">
                Come Visit Us
              </p>
              <h2 className="font-heading heading-lg text-[#1a2332] mb-6">
                Join us this Sunday at 10am!
              </h2>
              <div className="space-y-4 text-[#6b6561] body-lg">
                <p>
                  Hope Church is a place where everyone is welcome. No matter
                  where you are in your journey of faith, you&apos;ll find a warm
                  community that cares about you and wants to help you grow in
                  your relationship with God.
                </p>
                <p>
                  Come as you are &mdash; there&apos;s no dress code and no
                  judgment. Just real people worshiping a real God and experiencing
                  real life-change. We can&apos;t wait to meet you!
                </p>
              </div>
              <div className="mt-8">
                <Link href="/plan-your-visit" className="btn btn-primary">
                  Plan Your Visit
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
                </Link>
              </div>
            </div>

            {/* Right: Google Maps Embed */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(26,35,50,0.12)]">
              <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.0080675550516!2d-72.85348702247853!3d41.3521783713044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e7d120707580cd%3A0xd5a2be4a269b256e!2sHope%20Christian%20Church!5e0!3m2!1sen!2sus!4v1732061797087!5m2!1sen!2sus"
                  title="Hope Christian Church Location"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
