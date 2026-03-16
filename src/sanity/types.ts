import type { PortableTextBlock } from "@portabletext/types";

/* ------------------------------------------------------------------ */
/*  Shared                                                            */
/* ------------------------------------------------------------------ */

export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata: {
      dimensions: { width: number; height: number; aspectRatio: number };
      lqip: string;
    };
  } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | null;
  alt?: string | null;
}

export type PortableText = PortableTextBlock[];

/* ------------------------------------------------------------------ */
/*  Site Settings                                                     */
/* ------------------------------------------------------------------ */

export interface ServiceTime {
  dayOfWeek: string;
  time: string;
  label?: string | null;
}

export interface Address {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

export interface CoreValue {
  title: string;
  description?: string | null;
  icon?: string | null;
}

export interface SiteSettings {
  churchName: string;
  tagline?: string | null;
  missionStatement?: PortableText | null;
  logo?: SanityImage | null;
  launchDate?: string | null;
  serviceTimes?: ServiceTime[] | null;
  values?: CoreValue[] | null;
  navCtaLabel?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: Address | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  givingLink?: string | null;
  copyrightText?: string | null;
  footerTagline?: string | null;
  denominationText?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: SanityImage | null;
}

/* ------------------------------------------------------------------ */
/*  Home Page                                                         */
/* ------------------------------------------------------------------ */

export interface CtaButton {
  label: string;
  link: string;
  style?: "primary" | "outline" | null;
}

export interface Cta {
  label?: string | null;
  link?: string | null;
}

export interface HomeSection {
  sectionType: string;
  heading?: string | null;
  body?: PortableText | null;
  image?: SanityImage | null;
  cta?: Cta | null;
}

export interface GalleryImage extends SanityImage {
  caption?: string | null;
}

export interface HomePage {
  heroHeading?: string | null;
  heroSubheading?: string | null;
  heroImage?: SanityImage | null;
  heroVideoUrl?: string | null;
  heroCtas?: CtaButton[] | null;
  welcomeHeading?: string | null;
  welcomeBody?: PortableText | null;
  welcomeImage?: SanityImage | null;
  welcomeCtaLabel?: string | null;
  welcomeCtaLink?: string | null;
  galleryImages?: GalleryImage[] | null;
  sections?: HomeSection[] | null;
}

/* ------------------------------------------------------------------ */
/*  About Page                                                        */
/* ------------------------------------------------------------------ */

export interface Belief {
  title: string;
  description?: PortableText | null;
}

export interface AboutPage {
  heroHeading?: string | null;
  heroSubheading?: string | null;
  heroImage?: SanityImage | null;
  whoWeAreHeading?: string | null;
  whoWeAreBody?: PortableText | null;
  whoWeAreImage?: SanityImage | null;
  beliefsHeading?: string | null;
  beliefs?: Belief[] | null;
  denominationHeading?: string | null;
  denominationBody?: PortableText | null;
  denominationImage?: SanityImage | null;
  showStaff?: boolean | null;
}

/* ------------------------------------------------------------------ */
/*  Giving Page                                                       */
/* ------------------------------------------------------------------ */

export interface WayToGive {
  title: string;
  description?: string | null;
  icon?: string | null;
}

export interface GivingPage {
  heroHeading?: string | null;
  heroSubheading?: string | null;
  mainHeading?: string | null;
  mainBody?: PortableText | null;
  givingLink?: string | null;
  onlineGivingHeading?: string | null;
  onlineGivingBody?: string | null;
  onlineGivingButtonLabel?: string | null;
  waysToGive?: WayToGive[] | null;
  scriptureText?: string | null;
  scriptureReference?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Contact Page                                                      */
/* ------------------------------------------------------------------ */

export interface ContactPage {
  heroHeading?: string | null;
  heroSubheading?: string | null;
  formHeading?: string | null;
  formSubtitle?: string | null;
  recipientEmail?: string | null;
  successMessage?: string | null;
  quoteText?: string | null;
  quoteAttribution?: string | null;
  quoteRole?: string | null;
  showMap?: boolean | null;
  body?: PortableText | null;
}

/* ------------------------------------------------------------------ */
/*  Events Page (singleton)                                           */
/* ------------------------------------------------------------------ */

export interface EventsPage {
  heroHeading?: string | null;
  heroSubheading?: string | null;
  heroImage?: SanityImage | null;
  ctaHeading?: string | null;
  ctaBody?: string | null;
  ctaButtonLabel?: string | null;
  ctaButtonLink?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Staff Page (singleton)                                            */
/* ------------------------------------------------------------------ */

export interface StaffPage {
  heroHeading?: string | null;
  heroSubheading?: string | null;
  heroImage?: SanityImage | null;
  ctaHeading?: string | null;
  ctaBody?: string | null;
  ctaButtonLabel?: string | null;
  ctaButtonLink?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Event                                                             */
/* ------------------------------------------------------------------ */

export interface Event {
  _id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string | null;
  timeDisplay?: string | null;
  location?: string | null;
  category?: string | null;
  description?: PortableText | null;
  image?: SanityImage | null;
  registrationLink?: string | null;
  featured?: boolean | null;
  recurring?: boolean | null;
  recurrencePattern?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Sermon                                                            */
/* ------------------------------------------------------------------ */

export interface StaffReference {
  _id: string;
  name: string;
  role?: string | null;
  photo?: SanityImage | null;
}

export interface Sermon {
  _id: string;
  title: string;
  slug: string;
  preacher?: StaffReference | null;
  date: string;
  series?: string | null;
  scriptureReference?: string | null;
  description?: PortableText | null;
  videoUrl?: string | null;
  audioFileUrl?: string | null;
  audioUrl?: string | null;
  image?: SanityImage | null;
  order?: number | null;
}

/* ------------------------------------------------------------------ */
/*  Ministry                                                          */
/* ------------------------------------------------------------------ */

export interface Ministry {
  _id: string;
  name: string;
  slug: string;
  description?: PortableText | null;
  schedule?: string | null;
  leader?: StaffReference | null;
  contactEmail?: string | null;
  image?: SanityImage | null;
  order?: number | null;
}

/* ------------------------------------------------------------------ */
/*  Staff                                                             */
/* ------------------------------------------------------------------ */

export interface Staff {
  _id: string;
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  photo?: SanityImage | null;
  bio?: PortableText | null;
  order?: number | null;
}

/* ------------------------------------------------------------------ */
/*  Blog Post (Hope Church unique)                                    */
/* ------------------------------------------------------------------ */

export interface SanityBlogPost {
  name: string;
  slug: string;
  content: PortableTextBlock[];
  featuredSnippet: string;
  imageUrl: string;
  image: SanityImage;
  dateWritten: string;
  featuredOnHome: boolean;
}
