import type { Metadata } from "next";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "What We Believe",
  description:
    "Discover the core beliefs and doctrinal foundations of Hope Christian Church, rooted in Scripture and the Assemblies of God tradition. Our faith shapes everything we do.",
  openGraph: {
    title: "What We Believe",
    description:
      "Discover the core beliefs and doctrinal foundations of Hope Christian Church, rooted in Scripture and the Assemblies of God tradition.",
  },
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ScriptureRef {
  label: string;
  url: string;
}

interface Belief {
  number: number;
  title: string;
  description: string;
  refs: ScriptureRef[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

function bgUrl(ref: string): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=NIV`;
}

const BELIEFS: Belief[] = [
  {
    number: 1,
    title: "The Scriptures Inspired",
    description:
      "The Scriptures, both the Old and New Testaments, are verbally inspired of God and are the revelation of God to man, the infallible, authoritative rule of faith and conduct.",
    refs: [
      { label: "2 Timothy 3:15-17", url: bgUrl("2 Timothy 3:15-17") },
      { label: "1 Thessalonians 2:13", url: bgUrl("1 Thessalonians 2:13") },
      { label: "2 Peter 1:21", url: bgUrl("2 Peter 1:21") },
    ],
  },
  {
    number: 2,
    title: "The One True God",
    description:
      "The one true God has revealed Himself as the eternally self-existent \"I AM,\" the Creator of heaven and earth, and the Redeemer of mankind. He has further revealed Himself as embodying the principles of relationship and association as Father, Son, and Holy Spirit.",
    refs: [
      { label: "Deuteronomy 6:4", url: bgUrl("Deuteronomy 6:4") },
      { label: "Isaiah 43:10-11", url: bgUrl("Isaiah 43:10-11") },
      { label: "Matthew 28:19", url: bgUrl("Matthew 28:19") },
      { label: "Luke 3:22", url: bgUrl("Luke 3:22") },
    ],
  },
  {
    number: 3,
    title: "The Deity of the Lord Jesus Christ",
    description:
      "The Lord Jesus Christ is the eternal Son of God. The Scriptures declare His virgin birth, His sinless life, His miracles, His substitutionary work on the cross, His bodily resurrection from the dead, and His exaltation to the right hand of God.",
    refs: [
      { label: "Matthew 1:23", url: bgUrl("Matthew 1:23") },
      { label: "Hebrews 7:26", url: bgUrl("Hebrews 7:26") },
      { label: "Acts 2:22", url: bgUrl("Acts 2:22") },
      { label: "1 Corinthians 15:3", url: bgUrl("1 Corinthians 15:3") },
    ],
  },
  {
    number: 4,
    title: "The Fall of Man",
    description:
      "Man was created good and upright; for God said, \"Let us make man in our own image, after our likeness.\" However, man by voluntary transgression fell and thereby incurred not only physical death but also spiritual death, which is separation from God.",
    refs: [
      { label: "Genesis 1:26-27", url: bgUrl("Genesis 1:26-27") },
    ],
  },
  {
    number: 5,
    title: "The Salvation of Man",
    description:
      "Man's only hope of redemption is through the shed blood of Jesus Christ the Son of God. Salvation is received through repentance toward God and faith toward the Lord Jesus Christ, by the washing of regeneration and renewing of the Holy Spirit, and being justified by grace through faith.",
    refs: [
      { label: "Luke 24:47", url: bgUrl("Luke 24:47") },
      { label: "John 3:3", url: bgUrl("John 3:3") },
      { label: "Romans 10:13-15", url: bgUrl("Romans 10:13-15") },
      { label: "Ephesians 2:8", url: bgUrl("Ephesians 2:8") },
    ],
  },
  {
    number: 6,
    title: "The Ordinances of the Church",
    description:
      "Baptism in water by immersion is commanded in the Scriptures. All who repent and believe on Christ as Savior and Lord are to be baptized. Thus they declare to the world that they have died with Christ and that they also have been raised with Him to walk in newness of life.",
    refs: [
      { label: "Matthew 28:19", url: bgUrl("Matthew 28:19") },
      { label: "Acts 10:47-48", url: bgUrl("Acts 10:47-48") },
    ],
  },
  {
    number: 7,
    title: "The Baptism in the Holy Spirit",
    description:
      "All believers are entitled to and should ardently expect and earnestly seek the promise of the Father, the baptism in the Holy Spirit and fire, according to the command of our Lord Jesus Christ. This was the normal experience of all in the early Christian church.",
    refs: [
      { label: "Luke 24:49", url: bgUrl("Luke 24:49") },
      { label: "Acts 1:4", url: bgUrl("Acts 1:4") },
      { label: "Acts 1:8", url: bgUrl("Acts 1:8") },
      { label: "1 Corinthians 12:1-31", url: bgUrl("1 Corinthians 12:1-31") },
    ],
  },
  {
    number: 8,
    title: "The Initial Physical Evidence of the Baptism in the Holy Spirit",
    description:
      "The baptism of believers in the Holy Spirit is witnessed by the initial physical sign of speaking with other tongues as the Spirit of God gives them utterance.",
    refs: [
      { label: "Acts 2:4", url: bgUrl("Acts 2:4") },
    ],
  },
  {
    number: 9,
    title: "Sanctification",
    description:
      "Sanctification is an act of separation from that which is evil, and of dedication unto God. Sanctification is realized in the believer by recognizing his identification with Christ in His death and resurrection, and by faith reckoning daily upon the fact of that union.",
    refs: [
      { label: "Romans 12:1-2", url: bgUrl("Romans 12:1-2") },
      { label: "1 Thessalonians 5:23", url: bgUrl("1 Thessalonians 5:23") },
      { label: "Hebrews 13:12", url: bgUrl("Hebrews 13:12") },
    ],
  },
  {
    number: 10,
    title: "The Church and Its Mission",
    description:
      "The Church is the Body of Christ, the habitation of God through the Spirit, with divine appointments for the fulfillment of her Great Commission. Each believer, born of the Spirit, is an integral part of the general assembly and church of the firstborn.",
    refs: [
      { label: "Ephesians 1:22-23", url: bgUrl("Ephesians 1:22-23") },
      { label: "Ephesians 2:22", url: bgUrl("Ephesians 2:22") },
      { label: "Hebrews 12:23", url: bgUrl("Hebrews 12:23") },
    ],
  },
  {
    number: 11,
    title: "The Ministry",
    description:
      "A divinely called and scripturally ordained ministry has been provided by our Lord for the fourfold purpose of leading the Church in evangelization of the world, worship of God, building a Body of saints being perfected in the image of His Son, and meeting human need with ministries of love and compassion.",
    refs: [
      { label: "Mark 16:15-20", url: bgUrl("Mark 16:15-20") },
      { label: "Ephesians 4:11-16", url: bgUrl("Ephesians 4:11-16") },
    ],
  },
  {
    number: 12,
    title: "Divine Healing",
    description:
      "Divine healing is an integral part of the gospel. Deliverance from sickness is provided for in the atonement, and is the privilege of all believers.",
    refs: [
      { label: "Isaiah 53:4-5", url: bgUrl("Isaiah 53:4-5") },
      { label: "Matthew 8:16-17", url: bgUrl("Matthew 8:16-17") },
      { label: "James 5:14-16", url: bgUrl("James 5:14-16") },
    ],
  },
  {
    number: 13,
    title: "The Blessed Hope",
    description:
      "The resurrection of those who have fallen asleep in Christ and their translation together with those who are alive and remain unto the coming of the Lord is the imminent and blessed hope of the Church.",
    refs: [
      { label: "1 Thessalonians 4:16-17", url: bgUrl("1 Thessalonians 4:16-17") },
      { label: "Romans 8:23", url: bgUrl("Romans 8:23") },
      { label: "Titus 2:13", url: bgUrl("Titus 2:13") },
    ],
  },
  {
    number: 14,
    title: "The Millennial Reign of Christ",
    description:
      "The second coming of Christ includes the rapture of the saints, which is our blessed hope, followed by the visible return of Christ with His saints to reign on earth for one thousand years.",
    refs: [
      { label: "Zechariah 14:5", url: bgUrl("Zechariah 14:5") },
      { label: "Matthew 24:27", url: bgUrl("Matthew 24:27") },
      { label: "Revelation 1:7", url: bgUrl("Revelation 1:7") },
    ],
  },
  {
    number: 15,
    title: "The Final Judgment",
    description:
      "There will be a final judgment in which the wicked dead will be raised and judged according to their works. Whosoever is not found written in the Book of Life, together with the devil and his angels, the beast and the false prophet, will be consigned to the everlasting punishment in the lake which burns with fire and brimstone.",
    refs: [
      { label: "Matthew 25:46", url: bgUrl("Matthew 25:46") },
      { label: "Mark 9:43-48", url: bgUrl("Mark 9:43-48") },
      { label: "Revelation 19:20", url: bgUrl("Revelation 19:20") },
    ],
  },
  {
    number: 16,
    title: "The New Heavens and the New Earth",
    description:
      "We, according to His promise, look for new heavens and a new earth, wherein dwelleth righteousness.",
    refs: [
      { label: "2 Peter 3:13", url: bgUrl("2 Peter 3:13") },
      { label: "Revelation 21", url: bgUrl("Revelation 21") },
      { label: "Revelation 22", url: bgUrl("Revelation 22") },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Belief Card                                                        */
/* ------------------------------------------------------------------ */

function BeliefCard({ belief }: { belief: Belief }) {
  return (
    <div className="group bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(26,35,50,0.05)] hover:shadow-[0_6px_32px_rgba(26,35,50,0.1)] transition-all duration-500 border border-bg-alt">
      {/* Number badge */}
      <div className="flex items-start gap-5 mb-4">
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[0.85rem] font-bold">
          {belief.number}
        </span>
        <h3 className="font-heading text-primary text-xl md:text-[1.35rem] leading-snug pt-1.5">
          {belief.title}
        </h3>
      </div>

      <p className="text-text-muted text-[0.95rem] leading-relaxed mb-5 pl-[3.75rem]">
        {belief.description}
      </p>

      {/* Scripture References */}
      <div className="pl-[3.75rem] flex flex-wrap gap-2">
        {belief.refs.map((ref) => (
          <a
            key={ref.label}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-bg-alt hover:bg-accent/10 text-text-muted hover:text-accent text-[0.8rem] font-medium px-3 py-1.5 rounded-full transition-all duration-300"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            {ref.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function WhatWeBelievePage() {
  const leftColumn = BELIEFS.filter((_, i) => i % 2 === 0);
  const rightColumn = BELIEFS.filter((_, i) => i % 2 === 1);

  return (
    <div className="bg-bg min-h-screen">
      {/* ---- Hero ---- */}
      <section className="relative bg-primary pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(200,149,62,0.12)_0%,_transparent_60%)]" />
        <div className="section-padding relative z-10">
          <div className="container-wide text-center">
            <span className="inline-block text-accent text-[0.8rem] font-semibold tracking-[0.2em] uppercase mb-4">
              Our Foundation
            </span>
            <h1 className="heading-xl text-white font-heading text-balance">
              Our Beliefs
            </h1>
            <p className="mt-4 text-white/60 body-lg max-w-2xl mx-auto text-balance">
              The fundamental truths we hold dear, rooted in the Word of God and
              the historic Christian faith.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Beliefs Grid ---- */}
      <section className="section-padding section-padding-y">
        <div className="container-wide">
          {/* Two-column masonry-like layout on desktop */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {leftColumn.map((belief) => (
                <BeliefCard key={belief.number} belief={belief} />
              ))}
            </div>
            <div className="space-y-6">
              {rightColumn.map((belief) => (
                <BeliefCard key={belief.number} belief={belief} />
              ))}
            </div>
          </div>

          {/* Single column on mobile */}
          <div className="md:hidden space-y-6">
            {BELIEFS.map((belief) => (
              <BeliefCard key={belief.number} belief={belief} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Learn More CTA ---- */}
      <section className="section-padding pb-20 md:pb-28">
        <div className="container-wide">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,149,62,0.1)_0%,_transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="font-heading heading-md text-white mb-4">
                Want to Learn More?
              </h2>
              <p className="text-white/60 body-lg max-w-xl mx-auto mb-8">
                Explore the full position papers and doctrinal statements of the
                Assemblies of God.
              </p>
              <a
                href="https://ag.org/Beliefs/Position-Papers"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex"
              >
                Visit AG.org
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
      </section>
    </div>
  );
}
