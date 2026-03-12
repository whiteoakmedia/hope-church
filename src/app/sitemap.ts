import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { events } from "@/data/events";
import { sermons } from "@/data/sermons";

export const dynamic = "force-static";

const BASE = "https://hopeag.com";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.dateWritten),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${BASE}/events/${event.slug}`,
    lastModified: new Date(event.startTime),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const sermonPages: MetadataRoute.Sitemap = sermons.map((sermon) => ({
    url: `${BASE}/sermons/${sermon.slug}`,
    lastModified: new Date(sermon.datePreached),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...blogPages, ...eventPages, ...sermonPages];
}
