import type { Metadata } from "next";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Meet Pastor Jim and Sharon Detweiler, the heart and leadership behind Hope Christian Church in North Haven, CT. Learn about their ministry and vision.",
  openGraph: {
    title: "Leadership",
    description:
      "Meet Pastor Jim and Sharon Detweiler, the heart and leadership behind Hope Christian Church in North Haven, CT.",
  },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LeadershipPage() {
  return (
    <div className="bg-bg min-h-screen">
      {/* ---- Hero Section ---- */}
      <section className="relative bg-primary pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(200,149,62,0.12)_0%,_transparent_60%)]" />
        <div className="section-padding relative z-10">
          <div className="container-wide text-center">
            <span className="inline-block text-accent text-[0.8rem] font-semibold tracking-[0.2em] uppercase mb-4">
              Our Leadership
            </span>
            <h1 className="heading-xl text-white font-heading text-balance">
              Meet Pastor Jim and Sharon Detweiler
            </h1>
            <p className="mt-4 text-white/60 body-lg max-w-2xl mx-auto text-balance">
              Serving faithfully with hearts for God and the community of North
              Haven.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Bio Section ---- */}
      <section className="section-padding section-padding-y">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Text Column */}
            <div className="order-2 lg:order-1">
              <span className="inline-block text-accent text-[0.8rem] font-semibold tracking-[0.15em] uppercase mb-3">
                Pastors &amp; Chaplains
              </span>
              <h2 className="font-heading heading-md text-primary mb-6 accent-underline">
                Jim &amp; Sharon Detweiler
              </h2>

              <div className="space-y-5 text-text-muted body-lg">
                <p>
                  Jim and Sharon Detweiler both hail from the heart of
                  Pennsylvania. They met while attending Zion Bible College,
                  where they shared a calling to ministry and a deep love for
                  Christ that would shape the rest of their lives together.
                </p>
                <p>
                  The Detweilers are the proud parents of three sons: Nathan,
                  Nicholas, and Joshua. Their son Nicholas was born with Cornelia
                  DeLange Syndrome, a rare genetic condition that profoundly
                  shaped their family&apos;s journey of faith. After Nicholas
                  went to be with the Lord, Jim and Sharon moved back to
                  Pennsylvania, carrying with them a deeper understanding of
                  God&apos;s grace and the power of hope in the face of loss.
                </p>
                <p>
                  During this time, Jim became licensed with the Assemblies of
                  God, preparing for the next chapter God had in store. In 2000,
                  Jim and Sharon felt a clear call to New England, drawn to serve
                  the communities of Connecticut.
                </p>
                <p>
                  In 2005, they were led to Hope Christian Church, where Jim has
                  faithfully served as pastor ever since. Beyond the walls of the
                  church, Jim also serves as chaplain with the North Haven Fire
                  Department, bringing comfort, counsel, and the love of Christ
                  to first responders and their families.
                </p>
                <p>
                  Jim and Sharon are blessed to be grandparents to Evan, Bryton,
                  and Kinsley, who bring immeasurable joy to their lives.
                </p>
              </div>

              {/* Bible Passage */}
              <div className="mt-10 bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(26,35,50,0.06)] border border-bg-alt">
                <span className="text-accent text-[0.75rem] font-semibold tracking-[0.15em] uppercase block mb-3">
                  Their Favorite Passage
                </span>
                <blockquote className="border-l-4 border-accent pl-6">
                  <p className="font-heading text-primary text-lg md:text-xl italic leading-relaxed mb-3">
                    &ldquo;I will remember the deeds of the Lord; yes, I will
                    remember your miracles of long ago. I will consider all your
                    works and meditate on all your mighty deeds.&rdquo;
                  </p>
                  <cite className="text-text-muted text-[0.9rem] font-medium not-italic">
                    &mdash; Psalm 77:11-12 (NIV)
                  </cite>
                </blockquote>
              </div>
            </div>

            {/* Image Column */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-28">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(26,35,50,0.15)]">
                  <Image
                    src="/Hope-Staff-Photo.jpg"
                    alt="Pastor Jim and Sharon Detweiler"
                    width={700}
                    height={900}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
