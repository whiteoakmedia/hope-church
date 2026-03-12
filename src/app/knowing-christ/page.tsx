import type { Metadata } from "next";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Knowing Christ",
  description:
    "Begin a personal relationship with Jesus Christ. Learn how to find peace, hope, and salvation through faith.",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function KnowingChristPage() {
  return (
    <div className="bg-bg min-h-screen">
      {/* ---- Hero ---- */}
      <section className="relative bg-primary pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,149,62,0.15)_0%,_transparent_60%)]" />
        <div className="section-padding relative z-10">
          <div className="container-wide text-center">
            <span className="inline-block text-accent text-[0.8rem] font-semibold tracking-[0.2em] uppercase mb-4">
              Your Journey Begins
            </span>
            <h1 className="heading-xl text-white font-heading text-balance">
              Knowing Christ
            </h1>
            <p className="mt-4 text-white/60 body-lg max-w-2xl mx-auto text-balance">
              The most important decision you will ever make is to accept Jesus
              Christ as your personal Lord and Savior.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Main Content ---- */}
      <section className="section-padding section-padding-y">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Text + Prayer */}
            <div>
              <span className="block text-accent text-[0.8rem] font-semibold tracking-[0.15em] uppercase mb-3">
                A Prayer for Salvation
              </span>
              <h2 className="font-heading heading-md text-primary mb-6 accent-underline">
                Knowing Christ
              </h2>

              <div className="space-y-5 text-text-muted body-lg">
                <p>
                  God loves you and has a wonderful plan for your life. No
                  matter where you have been or what you have done, His grace is
                  sufficient, and His arms are open wide. Accepting Christ is as
                  simple as sincerely praying this prayer:
                </p>
              </div>

              {/* Prayer Card */}
              <div className="mt-8 bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_24px_rgba(26,35,50,0.08)] border border-bg-alt relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-light" />

                {/* Decorative cross icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c8953e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-primary text-lg">
                    Prayer of Salvation
                  </h3>
                </div>

                <blockquote className="text-primary text-[1.05rem] md:text-[1.1rem] leading-[1.9] italic">
                  <p>
                    &ldquo;Dear Lord Jesus, I know I am a sinner, and I ask for
                    Your forgiveness. I believe You died for my sins and rose from
                    the dead. I turn from my sins and invite You to come into my
                    heart and life. I want to trust and follow You as my Lord and
                    Savior.&rdquo;
                  </p>
                </blockquote>

                <p className="text-text-muted text-[0.95rem] mt-6 leading-relaxed">
                  If you have prayed this prayer and would like to begin your
                  journey of faith, we would love to hear from you and walk
                  alongside you.
                </p>

                {/* Contact Button */}
                <div className="mt-8">
                  <a
                    href="mailto:pastorjim@hopeag.com"
                    className="btn btn-primary"
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
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Click Here to Reach Out
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Image + Resource */}
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(26,35,50,0.15)]">
                  <Image
                    src="/Prayer-Image-Jack-Sharp.jpg"
                    alt="Prayer and faith"
                    width={700}
                    height={900}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-2xl -z-10" />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-2xl -z-10" />
              </div>

              {/* Peace with God Resource */}
              <div className="bg-primary rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(200,149,62,0.15)_0%,_transparent_70%)]" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c8953e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-white text-xl mb-3">
                    Find Peace with God
                  </h3>
                  <p className="text-white/60 text-[0.95rem] leading-relaxed mb-6">
                    Explore more about what it means to have a personal
                    relationship with Jesus Christ.
                  </p>
                  <a
                    href="https://peacewithgod.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex"
                  >
                    Visit PeaceWithGod.net
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
