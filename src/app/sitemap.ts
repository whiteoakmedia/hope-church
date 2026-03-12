import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import {
  BLOG_SLUGS_QUERY,
  EVENT_SLUGS_QUERY,
  SERMON_SLUGS_QUERY,
} from "@/sanity/queries";

const BASE = "https://hopeag.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, eventSlugs, sermonSlugs] = await Promise.all([
    client.fetch<{ slug: string }[]>(BLOG_SLUGS_QUERY),
    client.fetch<{ slug: string }[]>(EVENT_SLUGS_QUERY),
    client.fetch<{ slug: string }[]>(SERMON_SLUGS_QUERY),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/events`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/sermons`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/im-new`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/plan-your-visit`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/what-we-believe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/leadership`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/hope-kids`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/knowing-christ`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/prayer`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((s) => ({
    url: `${BASE}/blog/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const eventPages: MetadataRoute.Sitemap = eventSlugs.map((s) => ({
    url: `${BASE}/events/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const sermonPages: MetadataRoute.Sitemap = sermonSlugs.map((s) => ({
    url: `${BASE}/sermons/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...blogPages, ...eventPages, ...sermonPages];
}
