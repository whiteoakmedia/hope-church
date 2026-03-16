/* ------------------------------------------------------------------ */
/*  Re-export all types from SchemaTemplate                            */
/* ------------------------------------------------------------------ */

export type {
  SanityImage,
  PortableText,
  ServiceTime,
  Address,
  CoreValue,
  SiteSettings,
  CtaButton,
  Cta,
  GalleryImage,
  HomeSection,
  HomePage,
  Belief,
  AboutPage,
  WayToGive,
  GivingPage,
  ContactPage,
  EventsPage,
  StaffPage,
  Event,
  StaffReference,
  Sermon,
  Ministry,
  Staff,
} from "@whiteoakmedia/sanity-schemas";

/* ------------------------------------------------------------------ */
/*  Hope Church – specific types (not in SchemaTemplate)               */
/* ------------------------------------------------------------------ */

import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImage } from "@whiteoakmedia/sanity-schemas";

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
