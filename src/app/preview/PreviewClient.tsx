"use client";

import { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PreviewMessage {
  type: "cms-preview";
  page: string;
  data: Record<string, any>;
  settings: Record<string, any>;
}

interface ServiceTime {
  dayOfWeek?: string;
  time?: string;
  label?: string;
}

interface HeroCta {
  label?: string;
  link?: string;
  style?: string;
}

interface WayToGive {
  title?: string;
  description?: string;
  icon?: string;
}

interface Belief {
  title?: string;
  description?: PortableTextBlock[];
}

interface ArrayItem {
  title?: string;
  description?: string | PortableTextBlock[];
  icon?: string;
  label?: string;
  link?: string;
  style?: string;
  dayOfWeek?: string;
  time?: string;
  name?: string;
}

interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
  markDefs?: { _type: string; _key: string; href?: string }[];
}

interface SanityImageRef {
  asset?: { _ref?: string; _id?: string; url?: string };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function portableTextToHtml(blocks: unknown): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .map((block: PortableTextBlock) => {
      if (block._type !== "block") return "";
      let tag = "p";
      if (block.style === "h1") tag = "h1";
      else if (block.style === "h2") tag = "h2";
      else if (block.style === "h3") tag = "h3";
      else if (block.style === "h4") tag = "h4";
      else if (block.style === "blockquote") tag = "blockquote";

      const markDefs = block.markDefs || [];
      const text = (block.children || [])
        .map((child) => {
          let t = child.text || "";
          (child.marks || []).forEach((mark) => {
            if (mark === "strong") t = `<strong>${t}</strong>`;
            else if (mark === "em") t = `<em>${t}</em>`;
            else if (mark === "underline") t = `<u>${t}</u>`;
            else {
              const def = markDefs.find((d) => d._key === mark);
              if (def && def._type === "link")
                t = `<a href="${def.href || "#"}" class="text-accent hover:underline">${t}</a>`;
            }
          });
          return t;
        })
        .join("");

      if (block.listItem === "bullet") return `<li>${text}</li>`;
      if (block.listItem === "number") return `<li>${text}</li>`;
      return `<${tag}>${text}</${tag}>`;
    })
    .join("\n");
}

function imageUrl(img: unknown, settings: Record<string, any>): string {
  if (!img) return "";
  const imgObj = img as SanityImageRef;
  if (!imgObj.asset) return "";
  const ref = imgObj.asset._ref || imgObj.asset._id || "";
  if (!ref) return imgObj.asset.url || "";
  const parts = ref.replace("image-", "").split("-");
  if (parts.length < 3) return imgObj.asset.url || "";
  const id = parts.slice(0, parts.length - 2).join("-");
  const dims = parts[parts.length - 2];
  const fmt = parts[parts.length - 1];
  const projectId = settings._sanityProjectId || "";
  const dataset = settings._sanityDataset || "production";
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${fmt}`;
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Preview Client Component                                           */
/* ------------------------------------------------------------------ */

export default function PreviewClient() {
  const [page, setPage] = useState<string>("homePage");
  const [data, setData] = useState<Record<string, any>>({});
  const [settings, setSettings] = useState<Record<string, any>>({});

  const handleMessage = useCallback((event: MessageEvent) => {
    const msg = event.data as PreviewMessage;
    if (!msg || msg.type !== "cms-preview") return;
    setPage(msg.page);
    setData(msg.data || {});
    setSettings(msg.settings || {});
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    // Signal to parent that preview is ready
    window.parent.postMessage({ type: "cms-preview-ready" }, "*");
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const churchName = (settings.churchName as string) || "Your Church";
  const logoUrl = imageUrl(settings.logo, settings);

  // Show loading state until first message received
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-text-muted text-sm font-body">Waiting for content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Simplified Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${logoUrl}?w=120&h=48&fit=crop`} alt="" className="h-10 w-auto" />
            )}
            <span className="font-heading text-lg text-primary">{churchName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-text-muted font-body">
            <span>Home</span>
            <span>About</span>
            <span>Events</span>
            <span>Sermons</span>
            <span>Contact</span>
            {!!settings.givingLink && (
              <span className="btn btn-primary !py-2 !px-4 !text-xs">Give</span>
            )}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {renderPage(page, data, settings)}
      </main>

      {/* Simplified Footer */}
      <footer className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center">
            <h3 className="font-heading text-xl text-white mb-2">{churchName}</h3>
            {!!settings.footerTagline && (
              <p className="text-white/60 text-sm font-body mb-4">{String(settings.footerTagline)}</p>
            )}
            {!!settings.address && (
              <p className="text-white/50 text-sm font-body">
                {[(settings.address as Record<string, string>).street, (settings.address as Record<string, string>).city, (settings.address as Record<string, string>).state, (settings.address as Record<string, string>).zip].filter(Boolean).join(", ")}
              </p>
            )}
            <div className="mt-6 flex justify-center gap-4">
              {!!settings.facebook && <span className="text-white/40 text-xs font-body">Facebook</span>}
              {!!settings.youtube && <span className="text-white/40 text-xs font-body">YouTube</span>}
              {!!settings.instagram && <span className="text-white/40 text-xs font-body">Instagram</span>}
            </div>
            <p className="mt-6 text-white/30 text-xs font-body">
              {(settings.copyrightText as string) || `© ${new Date().getFullYear()} ${churchName}`}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Renderers                                                     */
/* ------------------------------------------------------------------ */

function renderPage(page: string, d: Record<string, any>, settings: Record<string, any>) {
  switch (page) {
    case "siteSettings": return <PreviewSiteSettings d={d} settings={settings} />;
    case "homePage": return <PreviewHomePage d={d} settings={settings} />;
    case "aboutPage": return <PreviewAboutPage d={d} settings={settings} />;
    case "givingPage": return <PreviewGivingPage d={d} settings={settings} />;
    case "contactPage": return <PreviewContactPage d={d} settings={settings} />;
    case "eventsPage":
    case "staffPage": return <PreviewHeroCta d={d} settings={settings} page={page} />;
    case "event": return <PreviewEvent d={d} settings={settings} />;
    case "sermon": return <PreviewSermon d={d} settings={settings} />;
    case "staff": return <PreviewStaff d={d} settings={settings} />;
    case "ministry": return <PreviewMinistry d={d} settings={settings} />;
    default: return <div className="section-padding section-padding-y text-center text-text-muted">Preview not available</div>;
  }
}

/* ── Shared Hero ────────────────────────────────────── */

function PreviewHeroSection({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const heroImg = imageUrl(d.heroImage, settings);
  const heading = d.heroHeading as string;
  const sub = d.heroSubheading as string;
  const ctas = d.heroCtas as HeroCta[] | undefined;

  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
      style={heroImg ? { backgroundImage: `url(${heroImg}?w=1200&h=600&fit=crop)`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {!heroImg && <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/90" />}
      {heroImg && <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/70 via-[#1a2332]/50 to-[#1a2332]/90" />}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {heading && <h1 className="heading-xl max-w-4xl text-white font-heading">{heading}</h1>}
        {sub && <p className="body-lg mt-6 max-w-2xl text-white/80 text-balance font-body">{sub}</p>}
        {ctas && ctas.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            {ctas.map((cta, i) =>
              cta.label ? (
                <span key={i} className={`btn ${cta.style === "outline" ? "btn-outline-light" : "btn-primary"} px-8 py-3 text-base`}>
                  {cta.label}
                </span>
              ) : null
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Site Settings ──────────────────────────────────── */

function PreviewSiteSettings({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const serviceTimes = d.serviceTimes as ServiceTime[] | undefined;
  const address = d.address as Record<string, string> | undefined;

  return (
    <>
      {/* Service times as hero-style badges */}
      {serviceTimes && serviceTimes.length > 0 && (
        <section className="bg-primary section-padding py-16 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
            Service Times
          </span>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {serviceTimes.map((st, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur-sm font-body">
                <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                {st.dayOfWeek && <strong>{st.dayOfWeek}</strong>}
                {st.time && <span>at {st.time}</span>}
                {st.label && <span className="text-white/60">({st.label})</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Contact info */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide max-w-2xl">
          <h2 className="heading-lg text-primary font-heading accent-underline">Contact Information</h2>
          <div className="mt-8 space-y-4">
            {d.email && (
              <div className="flex items-center gap-3 text-text-muted font-body">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>{d.email as string}</span>
              </div>
            )}
            {d.phone && (
              <div className="flex items-center gap-3 text-text-muted font-body">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <span>{d.phone as string}</span>
              </div>
            )}
            {address && (address.street || address.city) && (
              <div className="flex items-center gap-3 text-text-muted font-body">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{[address.street, address.city, address.state, address.zip].filter(Boolean).join(", ")}</span>
              </div>
            )}
          </div>

          {/* Social links */}
          {(d.facebook || d.instagram || d.youtube) && (
            <div className="mt-10">
              <h3 className="heading-sm text-primary font-heading mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                {["facebook", "instagram", "youtube", "twitter", "tiktok"].map((s) =>
                  d[s] ? (
                    <span key={s} className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-sm font-medium text-text-muted font-body">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ── Home Page ──────────────────────────────────────── */

function PreviewHomePage({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const welcomeImg = imageUrl(d.welcomeImage, settings);

  return (
    <>
      <PreviewHeroSection d={d} settings={settings} />

      {/* Welcome section */}
      {(d.welcomeHeading || d.welcomeBody) && (
        <section className="section-padding section-padding-y bg-bg">
          <div className="container-wide">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {welcomeImg && (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${welcomeImg}?w=600&h=400&fit=crop`} alt="" className="w-full rounded-xl shadow-2xl shadow-primary/10" />
                </div>
              )}
              <div>
                <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">Welcome</span>
                {d.welcomeHeading && <h2 className="heading-lg accent-underline text-primary font-heading">{d.welcomeHeading as string}</h2>}
                {d.welcomeBody && (
                  <div className="mt-8 text-text-muted font-body leading-relaxed prose" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.welcomeBody) }} />
                )}
                {d.welcomeCtaLabel && (
                  <span className="btn btn-primary mt-8 inline-flex">
                    {d.welcomeCtaLabel as string}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {(d.galleryImages as SanityImageRef[])?.length > 0 && (
        <section className="section-padding section-padding-y bg-bg-alt">
          <div className="container-wide">
            <div className="mb-8 text-center">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">Life at Church</span>
              <h2 className="heading-lg text-primary font-heading">Gallery</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(d.galleryImages as SanityImageRef[]).map((img, i) => {
                const url = imageUrl(img, settings);
                return url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={`${url}?w=400&h=300&fit=crop`} alt="" className="w-full rounded-xl object-cover aspect-[4/3]" />
                ) : null;
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ── About Page ─────────────────────────────────────── */

function PreviewAboutPage({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const whoImg = imageUrl(d.whoWeAreImage, settings);
  const beliefs = d.beliefs as Belief[] | undefined;
  const denomImg = imageUrl(d.denominationImage, settings);

  return (
    <>
      <PreviewHeroSection d={d} settings={settings} />

      {(d.whoWeAreHeading || d.whoWeAreBody) && (
        <section className="section-padding section-padding-y bg-bg">
          <div className="container-wide">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                {d.whoWeAreHeading && <h2 className="heading-lg accent-underline text-primary font-heading">{d.whoWeAreHeading as string}</h2>}
                {d.whoWeAreBody && (
                  <div className="mt-8 text-text-muted font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.whoWeAreBody) }} />
                )}
              </div>
              {whoImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${whoImg}?w=600&h=400&fit=crop`} alt="" className="w-full rounded-xl shadow-lg" />
              )}
            </div>
          </div>
        </section>
      )}

      {beliefs && beliefs.length > 0 && (
        <section className="section-padding section-padding-y bg-bg-alt">
          <div className="container-wide">
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">Our Faith</span>
              <h2 className="heading-lg text-primary font-heading">{(d.beliefsHeading as string) || "What We Believe"}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {beliefs.map((b, i) => (
                <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
                  {b.title && <h3 className="heading-sm text-primary font-heading mb-3">{b.title}</h3>}
                  {b.description && <div className="text-text-muted font-body text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(b.description) }} />}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(d.denominationHeading || d.denominationBody) && (
        <section className="section-padding section-padding-y bg-bg">
          <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
            <div>
              {d.denominationHeading && <h2 className="heading-lg accent-underline text-primary font-heading">{d.denominationHeading as string}</h2>}
              {d.denominationBody && <div className="mt-8 text-text-muted font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.denominationBody) }} />}
            </div>
            {denomImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${denomImg}?w=600&h=400&fit=crop`} alt="" className="w-full rounded-xl shadow-lg" />
            )}
          </div>
        </section>
      )}
    </>
  );
}

/* ── Giving Page ────────────────────────────────────── */

function PreviewGivingPage({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const ways = d.waysToGive as WayToGive[] | undefined;

  return (
    <>
      <PreviewHeroSection d={d} settings={settings} />

      {(d.mainHeading || d.mainBody) && (
        <section className="section-padding section-padding-y bg-bg">
          <div className="container-wide max-w-3xl text-center">
            {d.mainHeading && <h2 className="heading-lg text-primary font-heading">{d.mainHeading as string}</h2>}
            {d.mainBody && <div className="mt-6 text-text-muted font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.mainBody) }} />}
            {d.onlineGivingButtonLabel && (
              <span className="btn btn-primary mt-8 inline-flex text-base px-8 py-3">
                {d.onlineGivingButtonLabel as string}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            )}
          </div>
        </section>
      )}

      {ways && ways.length > 0 && (
        <section className="section-padding section-padding-y bg-bg-alt">
          <div className="container-wide">
            <div className="mb-12 text-center">
              <h2 className="heading-lg text-primary font-heading">Ways to Give</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ways.map((w, i) => (
                <div key={i} className="rounded-xl bg-white p-8 shadow-sm text-center">
                  {w.title && <h3 className="heading-sm text-primary font-heading mb-3">{w.title}</h3>}
                  {w.description && <p className="text-text-muted font-body text-sm">{w.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {d.scriptureText && (
        <section className="section-padding section-padding-y bg-primary text-center">
          <div className="container-wide max-w-3xl">
            <blockquote className="font-heading text-xl text-white/90 italic leading-relaxed">
              &ldquo;{d.scriptureText as string}&rdquo;
            </blockquote>
            {d.scriptureReference && (
              <cite className="mt-4 block text-accent text-sm font-body not-italic">
                {d.scriptureReference as string}
              </cite>
            )}
          </div>
        </section>
      )}
    </>
  );
}

/* ── Contact Page ───────────────────────────────────── */

function PreviewContactPage({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  return (
    <>
      <PreviewHeroSection d={d} settings={settings} />

      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form mock */}
            <div>
              {d.formHeading && <h2 className="heading-lg accent-underline text-primary font-heading">{d.formHeading as string}</h2>}
              {d.formSubtitle && <p className="mt-4 text-text-muted font-body">{d.formSubtitle as string}</p>}
              <div className="mt-8 space-y-4">
                <div className="rounded-lg border border-bg-alt bg-white px-4 py-3 text-sm text-text-light font-body">Name</div>
                <div className="rounded-lg border border-bg-alt bg-white px-4 py-3 text-sm text-text-light font-body">Email</div>
                <div className="rounded-lg border border-bg-alt bg-white px-4 py-3 text-sm text-text-light font-body h-24">Message</div>
                <span className="btn btn-primary">Send Message</span>
              </div>
              {d.successMessage && (
                <p className="mt-4 text-sm text-accent font-body italic">Success: {d.successMessage as string}</p>
              )}
            </div>

            {/* Quote */}
            {d.quoteText && (
              <div className="flex items-center">
                <div className="rounded-xl bg-bg-alt p-8 border-l-4 border-accent">
                  <blockquote className="font-heading text-lg text-primary italic leading-relaxed">
                    &ldquo;{d.quoteText as string}&rdquo;
                  </blockquote>
                  {d.quoteAttribution && (
                    <div className="mt-4 font-body text-sm text-text-muted">
                      — {d.quoteAttribution as string}
                      {d.quoteRole && <span className="text-text-light">, {d.quoteRole as string}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Events/Staff Page (Hero + CTA) ─────────────────── */

function PreviewHeroCta({ d, settings, page }: { d: Record<string, any>; settings: Record<string, any>; page: string }) {
  const label = page === "eventsPage" ? "Events" : "Staff";

  return (
    <>
      <PreviewHeroSection d={d} settings={settings} />

      {/* Placeholder content area */}
      <section className="section-padding section-padding-y bg-bg text-center">
        <div className="container-wide">
          <p className="text-text-light font-body">{label} will appear here</p>
        </div>
      </section>

      {/* CTA band */}
      {d.ctaHeading && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-[#b8842e] to-[#a87324]" />
          <div className="relative z-10 section-padding section-padding-y">
            <div className="container-wide text-center">
              <h2 className="heading-lg max-w-3xl mx-auto text-white font-heading">{d.ctaHeading as string}</h2>
              {d.ctaBody && <p className="body-lg mt-6 max-w-xl mx-auto text-white/85 text-balance font-body">{d.ctaBody as string}</p>}
              {d.ctaButtonLabel && (
                <span className="btn mt-10 inline-flex items-center gap-2 bg-white px-8 py-3 text-base font-semibold text-primary">
                  {d.ctaButtonLabel as string}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ── Collection Item Previews ───────────────────────── */

function PreviewEvent({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const eventImg = imageUrl(d.image, settings);

  return (
    <section className="section-padding section-padding-y bg-bg">
      <div className="container-wide max-w-3xl">
        {eventImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${eventImg}?w=800&h=400&fit=crop`} alt="" className="w-full rounded-xl mb-8 shadow-lg" />
        )}
        <h1 className="heading-lg text-primary font-heading">{(d.title as string) || "Event Title"}</h1>
        {d.date && <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-accent font-body">{formatDate(d.date as string)}</p>}
        {d.timeDisplay && <p className="mt-1 text-text-muted font-body">{d.timeDisplay as string}</p>}
        {d.location && (
          <div className="mt-3 flex items-center gap-2 text-text-muted font-body">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {d.location as string}
          </div>
        )}
        {d.description && (
          <div className="mt-8 text-text-muted font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.description) }} />
        )}
        {d.registrationLink && (
          <span className="btn btn-primary mt-8 inline-flex text-base px-8 py-3">
            Register
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </span>
        )}
      </div>
    </section>
  );
}

function PreviewSermon({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const sermonImg = imageUrl(d.image, settings);

  return (
    <section className="section-padding section-padding-y bg-bg">
      <div className="container-wide max-w-3xl">
        {sermonImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${sermonImg}?w=800&h=400&fit=crop`} alt="" className="w-full rounded-xl mb-8 shadow-lg" />
        )}
        <h1 className="heading-lg text-primary font-heading">{(d.title as string) || "Sermon Title"}</h1>
        {d.date && <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-accent font-body">{formatDate(d.date as string)}</p>}
        {d.series && <p className="mt-1 text-text-muted font-body">Series: {d.series as string}</p>}
        {d.scriptureReference && <p className="mt-1 text-text-muted font-body">{d.scriptureReference as string}</p>}
        {d.description && (
          <div className="mt-8 text-text-muted font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.description) }} />
        )}
        <div className="mt-8 flex gap-4">
          {d.videoUrl && <span className="btn btn-primary">Watch</span>}
          {d.audioUrl && <span className="btn btn-outline">Listen</span>}
        </div>
      </div>
    </section>
  );
}

function PreviewStaff({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const photoUrl = imageUrl(d.photo, settings);

  return (
    <section className="section-padding section-padding-y bg-bg">
      <div className="container-wide max-w-2xl text-center">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${photoUrl}?w=300&h=300&fit=crop`} alt="" className="mx-auto h-40 w-40 rounded-full object-cover shadow-lg mb-6" />
        ) : (
          <div className="mx-auto h-40 w-40 rounded-full bg-bg-alt flex items-center justify-center mb-6">
            <span className="font-heading text-4xl text-text-light">{((d.name as string) || "?")[0]}</span>
          </div>
        )}
        <h1 className="heading-lg text-primary font-heading">{(d.name as string) || "Staff Name"}</h1>
        {d.role && <p className="mt-2 text-accent font-body font-medium">{d.role as string}</p>}
        {d.email && <p className="mt-1 text-text-muted font-body text-sm">{d.email as string}</p>}
        {d.bio && (
          <div className="mt-8 text-left text-text-muted font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.bio) }} />
        )}
      </div>
    </section>
  );
}

function PreviewMinistry({ d, settings }: { d: Record<string, any>; settings: Record<string, any> }) {
  const ministryImg = imageUrl(d.image, settings);

  return (
    <section className="section-padding section-padding-y bg-bg">
      <div className="container-wide max-w-3xl">
        {ministryImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${ministryImg}?w=800&h=350&fit=crop`} alt="" className="w-full rounded-xl mb-8 shadow-lg" />
        )}
        <h1 className="heading-lg text-primary font-heading">{(d.name as string) || "Ministry Name"}</h1>
        {d.schedule && (
          <div className="mt-3 flex items-center gap-2 text-text-muted font-body">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {d.schedule as string}
          </div>
        )}
        {d.contactEmail && (
          <div className="mt-2 flex items-center gap-2 text-text-muted font-body">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {d.contactEmail as string}
          </div>
        )}
        {d.description && (
          <div className="mt-8 text-text-muted font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: portableTextToHtml(d.description) }} />
        )}
      </div>
    </section>
  );
}
