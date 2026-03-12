import type { PortableTextBlock } from "@portabletext/types";

export interface SanitySermon {
  name: string;
  slug: string;
  speaker: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  description: string;
  datePreached: string;
}

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

export interface SanityEvent {
  name: string;
  slug: string;
  imageUrl: string;
  image: SanityImage;
  description: string;
  location: string;
  startTime: string;
  endTime?: string;
  registerLink?: string;
  promoVideo?: string;
  isKids: boolean;
  isYouth: boolean;
  archived: boolean;
}

export interface SanityImage {
  asset: { _ref: string; _type: string };
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface SiteSettings {
  churchName: string;
  phone: string;
  email: string;
  address: string;
  sundayTime: string;
  wednesdayTime: string;
  welcomeVideoId: string;
  giveUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  heroImage: SanityImage;
  heroHeading: string;
  heroSubtext: string;
  ctaHeading: string;
  ctaSubtext: string;
}
