/* ------------------------------------------------------------------ */
/*  Re-export all standard queries from SchemaTemplate                 */
/* ------------------------------------------------------------------ */

export {
  siteSettingsQuery,
  homePageQuery,
  aboutPageQuery,
  givingPageQuery,
  contactPageQuery,
  eventsPageQuery,
  staffPageQuery,
  eventsQuery,
  upcomingEventsQuery,
  featuredEventsQuery,
  sermonsQuery,
  latestSermonQuery,
  sermonsBySeriesQuery,
  ministriesQuery,
  staffQuery,
} from "@whiteoakmedia/sanity-schemas";

/* ------------------------------------------------------------------ */
/*  Hope Church – specific queries (not in SchemaTemplate)             */
/* ------------------------------------------------------------------ */

const imageFields = `asset->{ _id, url, metadata { dimensions, lqip } }, hotspot, crop, alt`;
const portableTextField = `[]{ ..., markDefs[]{ ... } }`;

/* Event detail & slugs */

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    date,
    endDate,
    timeDisplay,
    location,
    category,
    description ${portableTextField},
    image { ${imageFields} },
    registrationLink,
    featured,
    recurring,
    recurrencePattern
  }
`;

export const eventSlugsQuery = `
  *[_type == "event"]{ "slug": slug.current }
`;

/* Sermon detail & slugs */

export const sermonBySlugQuery = `
  *[_type == "sermon" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    preacher->{ _id, name, role, photo { ${imageFields} } },
    date,
    series,
    scriptureReference,
    description ${portableTextField},
    videoUrl,
    "audioFileUrl": audioFile.asset->url,
    audioUrl,
    image { ${imageFields} },
    order
  }
`;

export const sermonSlugsQuery = `
  *[_type == "sermon"]{ "slug": slug.current }
`;

/* CRON sync helpers */

export const sermonsByVideoIdsQuery = `
  *[_type == "sermon" && videoUrl in $videoIds] {
    _id,
    title,
    description,
    videoUrl,
    date
  }
`;

export const sermonSlugExistsQuery = `
  count(*[_type == "sermon" && slug.current == $slug]) > 0
`;

export const allSyncedSermonsQuery = `
  *[_type == "sermon" && defined(videoUrl)] {
    _id,
    videoUrl
  }
`;

/* Blog posts (Hope Church unique) */

export const blogPostsQuery = `
  *[_type == "blogPost"] | order(dateWritten desc) {
    name,
    "slug": slug.current,
    content,
    featuredSnippet,
    "imageUrl": image.asset->url,
    image,
    dateWritten,
    featuredOnHome
  }
`;

export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    content,
    featuredSnippet,
    "imageUrl": image.asset->url,
    image,
    dateWritten,
    featuredOnHome
  }
`;

export const blogSlugsQuery = `
  *[_type == "blogPost"]{ "slug": slug.current }
`;
